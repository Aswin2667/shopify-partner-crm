pipeline {
    agent any
    
    environment {
        HEROKU_API_KEY = credentials('heroku-api-key') // Jenkins credential containing the Heroku API key
        HEROKU_APP_NAME = 'your-app-name'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/your-repository.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('your-app-name')
                }
            }
        }
        
        stage('Login to Heroku Container Registry') {
            steps {
                sh 'echo $HEROKU_API_KEY | docker login --username=_ --password-stdin registry.heroku.com'
            }
        }
        
        stage('Push Docker Image to Heroku') {
            steps {
                script {
                    docker.withRegistry('https://registry.heroku.com') {
                        def appImage = docker.image("registry.heroku.com/${HEROKU_APP_NAME}/web")
                        appImage.push('latest')
                    }
                }
            }
        }
        
        stage('Release Heroku App') {
            steps {
                sh "heroku container:release web --app $HEROKU_APP_NAME"
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
