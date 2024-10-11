pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Aswin2667/shopify-partner-crm.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('apps/client') {
                     script {
                        sh 'sudo docker build -t shopcrm-client .'
                    }
                }
            }
        }
    }
}
