# AWS EC2 deployment (existing MongoDB container)

This configuration is for the existing Ubuntu EC2 host **13.210.172.242** and MongoDB created separately using `compose.mongo.yaml`. It **does not create a second MongoDB** and does not use Atlas, DigitalOcean or Docker Hub.

## Before first deploy

1. Confirm `docker ps` shows `hotel-booking-mongo`.
2. Get its Docker network: `docker inspect hotel-booking-mongo --format '{{range $name, $_ := .NetworkSettings.Networks}}{{$name}}{{end}}'`. By default the application expects `hotel-booking_hotel_network`. If different, set `MONGO_DOCKER_NETWORK=<actual network>` in `/opt/hotel-booking/.env` (preserve existing Mongo root credentials).
3. Copy `backend.aws.env.example` to `/opt/hotel-booking/backend.env`. Replace all placeholders with actual secrets; the `hoteluser` password must match the existing MongoDB user. Run `chmod 600 /opt/hotel-booking/{.env,backend.env}`.
4. `docker compose -f compose.aws.yaml config -q`, then `docker compose -f compose.aws.yaml up -d --build`.
5. Check `docker compose -f compose.aws.yaml ps`, `logs api`, then `curl -f http://127.0.0.1/healthz`.

Do not run `docker compose down -v` for the MongoDB project. Do not expose ports 5000 or 27017 in the EC2 security group. Port 80 is for the initial HTTP lab only. Use a domain and HTTPS before enabling OAuth, sessions, payments or real user data.

## Jenkins setup

This is an SSH deploy pipeline. Jenkins itself stays wherever port 8080 is already running. Make sure the Jenkins build agent has `git`, `tar`, `ssh`, `scp`, and `curl`, and can reach EC2 TCP/22; add its public IP to the EC2 security group's SSH allowlist if needed.

Create Jenkins credential **SSH Username with private key** ID `aws-ec2-ssh`, username `ubuntu`, with a dedicated deployment key authorized on EC2. Verify the server host key and install it in the Jenkins agent user's `~/.ssh/known_hosts` (not just your personal Mac user's). The remote user must be able to run Docker and write `/opt/hotel-booking`.

Create Pipeline Job: **Pipeline script from SCM**, Git URL `https://github.com/nguyenphuongtra/Hotel-Booking.git`, branch `*/main` after merging the PR, script path `Jenkinsfile`. If Jenkins is local and inaccessible to GitHub webhooks, configure Poll SCM `H/5 * * * *`.

EC2 t3.small has only 2 GiB RAM. Building the React frontend remotely can require temporary swap or a larger instance; monitor `free -h` and logs. Database secrets and its Docker volume stay on EC2. The pipeline does not automatically roll back failed releases.

## Operational checks

```sh
cd /opt/hotel-booking
docker compose -f compose.aws.yaml ps
docker compose -f compose.aws.yaml logs --tail=100 api frontend
docker logs --tail=50 hotel-booking-mongo
curl -i http://127.0.0.1/healthz
```
