pipeline {
    agent any

    environment {
        DOCR_REGISTRY = 'registry.digitalocean.com'
        DOCR_NAMESPACE = 'YOUR_REGISTRY'
        DROPLET_HOST = 'YOUR_DROPLET_IP'
        APP_DOMAIN = 'booking.example.com'
        DEPLOY_DIR = '/opt/hotel-booking'
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Checkout and build') {
            steps {
                checkout scm
                sh '''
                    set -eu
                                        docker build -f backend/Dockerfile -t "$DOCR_REGISTRY/$DOCR_NAMESPACE/hotel-booking-api:$GIT_COMMIT" backend
                    docker build -f frontend/Dockerfile --build-arg VITE_API_URL=/api \
                                            -t "$DOCR_REGISTRY/$DOCR_NAMESPACE/hotel-booking-frontend:$GIT_COMMIT" frontend
                '''
            }
        }

        stage('Push to DigitalOcean Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'do-cr-credentials',
                    usernameVariable: 'DOCR_USERNAME',
                    passwordVariable: 'DOCR_PASSWORD'
                )]) {
                    sh '''
                        set -eu
                        printf '%s' "$DOCR_PASSWORD" | docker login "$DOCR_REGISTRY" \
                          --username "$DOCR_USERNAME" --password-stdin
                        docker push "$DOCR_REGISTRY/$DOCR_NAMESPACE/hotel-booking-api:$GIT_COMMIT"
                        docker push "$DOCR_REGISTRY/$DOCR_NAMESPACE/hotel-booking-frontend:$GIT_COMMIT"
                        docker logout "$DOCR_REGISTRY"
                    '''
                }
            }
        }

        stage('Deploy to Droplet') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'do-cr-credentials',
                        usernameVariable: 'DOCR_USERNAME',
                        passwordVariable: 'DOCR_PASSWORD'
                    ),
                    sshUserPrivateKey(
                        credentialsId: 'do-droplet-ssh',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu
                        ssh -i "$SSH_KEY" "$SSH_USER@$DROPLET_HOST" "mkdir -p '$DEPLOY_DIR'"
                        scp -i "$SSH_KEY" compose.deploy.yaml Caddyfile \
                          "$SSH_USER@$DROPLET_HOST:$DEPLOY_DIR/"
                        printf '%s' "$DOCR_PASSWORD" | ssh -i "$SSH_KEY" "$SSH_USER@$DROPLET_HOST" \
                          "docker login '$DOCR_REGISTRY' --username '$DOCR_USERNAME' --password-stdin"
                        ssh -i "$SSH_KEY" "$SSH_USER@$DROPLET_HOST" \
                          "printf 'DOCR_REGISTRY=%s\\nDOCR_NAMESPACE=%s\\nIMAGE_TAG=%s\\nAPP_DOMAIN=%s\\n' '$DOCR_REGISTRY' '$DOCR_NAMESPACE' '$GIT_COMMIT' '$APP_DOMAIN' > '$DEPLOY_DIR/deploy.env' && cd '$DEPLOY_DIR' && docker compose --env-file deploy.env -f compose.deploy.yaml pull && docker compose --env-file deploy.env -f compose.deploy.yaml up -d --remove-orphans"
                    '''
                }
            }
        }
    }
}