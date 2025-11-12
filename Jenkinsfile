pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = 'mohamedbouneb/mern-backend'
        VERSION = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Cloning repository...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🚀 Building Docker image...'
                script {
                    // Ensure Docker exists before trying to build
                    def dockerExists = sh(script: 'which docker', returnStatus: true) == 0
                    if (dockerExists) {
                        sh "docker build -t ${IMAGE_NAME}:${VERSION} ."
                    } else {
                        error('❌ Docker is not installed or not accessible on this Jenkins agent.')
                    }
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                echo '🔐 Logging into DockerHub...'
                script {
                    sh """
                    echo '${DOCKERHUB_CREDENTIALS_PSW}' | docker login -u '${DOCKERHUB_CREDENTIALS_USR}' --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "📤 Pushing image ${IMAGE_NAME}:${VERSION} to DockerHub..."
                script {
                    sh "docker push ${IMAGE_NAME}:${VERSION}"
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            script {
                // Clean only if Docker exists
                def dockerExists = sh(script: 'which docker', returnStatus: true) == 0
                if (dockerExists) {
                    sh 'docker system prune -f'
                } else {
                    echo '⚠️ Docker not found — skipping cleanup.'
                }
            }
        }
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
