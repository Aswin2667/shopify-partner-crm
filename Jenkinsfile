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

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment to Heroku was successful!'
        }
        failure {
            echo 'Deployment to Heroku failed.'
        }
    }
}
