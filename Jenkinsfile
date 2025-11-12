pipeline {
    // "Exécute ce pipeline sur n'importe quel agent Jenkins disponible"
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = 'mohamedbouneb/mern-backend'
        VERSION = "${env.BUILD_NUMBER}"
    }
    
    stages {
        
        // 🏗️ Étape 1: Build
        stage('Build') {
            steps {
                echo '🚀 Construction de l image Docker...'
                script {
                    docker.build("${IMAGE_NAME}:${VERSION}")
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Nettoyage...'
            sh 'docker system prune -f'
        }
        success {
            echo '✅ Pipeline exécuté avec succès!'
        }
        failure {
            echo '❌ Échec du pipeline!'
        }
    }
}