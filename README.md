# Light control with ESP8266 and Google Cloud.

# Installation

## Setup Google Cloud

- Install [gcloud comand line tools](https://cloud.google.com/sdk/docs/quickstart-macos)

- Authenticate with Google Cloud and set default credentials, needed to connect the device to the cloud.

```
gcloud auth application-default login
```

- Create cloud project. Choose unique project name:

```

gcloud projects create PROJECT_NAME
```

- List the projects

```
gcloud projects list
```

- Set current project for `gcloud`:

```
gcloud config set project PROJECT_NAME
```

- Create device registry in `IoT Core`:

```
gcloud iot registries create IOT_REGISTRY_NAME --region us-central1
```

## Setup Device

- Get the google cloud `project ID`:

```
gcloud projects list
```

- Register the device in Google IoT Core. This command generate the public/private key pair and configure the device:

```
mos gcp-iot-setup --gcp-project PROJECT_ID --gcp-region us-central1 --gcp-registry IOT_REGISTRY_NAME
```

# Credentials for testing nodejs server.

- Create service account

```
gcloud iam service-accounts create ACCOUNT_NAME
```

- Grant permissions to the service account.

```
gcloud projects add-iam-policy-binding PROJECT_ID --member "serviceAccount:ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com" --role "roles/owner"
```

- Create key file. FILE_NAME will be stored.

```
gcloud iam service-accounts keys create FILE_NAME.json --iam-account ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com
```

- Set the enviroment variable to use de key (macOs or Linux):

```
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/file/FILE_NAME.json"
```

# Commands

Build Firmware locally and flash. Docker must be running.

```
mos build --platform esp8266 --local --verbose
mos flash
```

Check board configurations:

```
mos config-get board
```

Configure Wifi

```
mos wifi <ssid> <password>
```

Upload files. There is no need to build firmware and flash device unless you load more libs. After the flash, you only need to upload the modified files to the device.

```
mos put init.js
```

Configure gcp iot-core

```
mos gcp-iot-setup --gcp-project <project-id> --gcp-region us-central1 --gcp-registry <registry-name>
```
