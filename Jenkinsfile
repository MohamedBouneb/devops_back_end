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
        
        // 🔍 Étape 2: Scan des vulnérabilités
        stage('Scan Sécurité') {
            steps {
                echo '🔍 Scan des vulnérabilités avec Trivy...'
                sh '''
                    trivy image --exit-code 0 --severity CRITICAL,HIGH ${IMAGE_NAME}:${VERSION}
                    trivy image --exit-code 1 --severity CRITICAL ${IMAGE_NAME}:${VERSION}
                '''
            }
        }
        
        // 📦 Étape 3: Push vers Docker Hub
        stage('Push Docker Hub') {
            steps {
                echo '📦 Push vers Docker Hub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("${IMAGE_NAME}:${VERSION}").push()
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }
        
        // 🚀 Étape 4: Déploiement (Optionnel)
        stage('Déploiement') {
            steps {
                echo '🚀 Déploiement en production...'
                sh '''
                    docker-compose -f docker-compose.prod.yml pull
                    docker-compose -f docker-compose.prod.yml up -d
                '''
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