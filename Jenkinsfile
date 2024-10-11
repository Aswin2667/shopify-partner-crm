pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/your-repository.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('apps/client') {
                    script {
                        docker.build('shopcrm-client')
                    }
                }
            }
        }
    }
}
