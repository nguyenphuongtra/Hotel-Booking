pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }
  environment {
    EC2_HOST = '13.210.172.242'
    DEPLOY_DIR = '/opt/hotel-booking'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Validate') {
      steps {
        sh '''
          set -eu
          test -f compose.aws.yaml
          test -f backend/Dockerfile
          test -f frontend/Dockerfile
          test -f frontend/nginx.conf
          test -f backend/package-lock.json
          test -f frontend/package-lock.json
        '''
      }
    }
    stage('Package') {
      steps {
        sh '''
          set -eu
          tar -czf hotel-booking-source.tar.gz \
            --exclude=node_modules \
            --exclude=.git \
            --exclude=.env \
            --exclude='.env.*' \
            --exclude=dist \
            backend frontend compose.aws.yaml
        '''
      }
    }
    stage('Deploy to EC2') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'aws-ec2-ssh',
          keyFileVariable: 'SSH_KEY',
          usernameVariable: 'SSH_USER'
        )]) {
          sh '''
            set -eu
            ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
              "$SSH_USER@$EC2_HOST" "mkdir -p '$DEPLOY_DIR'"
            scp -i "$SSH_KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
              hotel-booking-source.tar.gz "$SSH_USER@$EC2_HOST:$DEPLOY_DIR/"
            ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
              "$SSH_USER@$EC2_HOST" "DEPLOY_DIR='$DEPLOY_DIR' bash -se" <<'REMOTE'
set -eu
cd "$DEPLOY_DIR"
test -s .env
test -s backend.env
test -f compose.mongo.yaml
docker inspect hotel-booking-mongo >/dev/null
tar -xzf hotel-booking-source.tar.gz
docker compose -f compose.aws.yaml config -q
docker compose -f compose.aws.yaml build
docker compose -f compose.aws.yaml up -d --remove-orphans
docker compose -f compose.aws.yaml ps
rm -f hotel-booking-source.tar.gz
REMOTE
          '''
        }
      }
    }
    stage('Health check') {
      steps {
        sh '''
          set -eu
          for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
            if curl --fail --silent --show-error --max-time 10 \
                 "http://$EC2_HOST/healthz"; then
              echo "Deployment healthy"
              exit 0
            fi
            sleep 10
          done
          echo "Deployment failed health check" >&2
          exit 1
        '''
      }
    }
  }
  post {
    always { sh 'rm -f hotel-booking-source.tar.gz || true' }
  }
}
