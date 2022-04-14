pipeline {
    agent any
	
	environment {
        clientRegistry = "repository.k8sengineers.com/apexrepo/client"
        booksRegistry = "repository.k8sengineers.com/apexrepo/books"
        mainRegistry = "repository.k8sengineers.com/apexrepo/main"
        registryCredential = 'NexusRepoLogin'
        cartRegistry = "https://repository.k8sengineers.com"
    }
	
	stages {
	
	  stage('Build Angular Image') {
        when { changeset "client/*"}
	     steps {
		   
		     script {
                dockerImage = docker.build( clientRegistry + ":$BUILD_NUMBER", "./client/")
             }

		 }
	  
	  }
	  
	  stage('Deploy Angular Image') {
          when { changeset "client/*"}
          steps{
            script {
              docker.withRegistry( cartRegistry, registryCredential ) {
                dockerImage.push("$BUILD_NUMBER")
                dockerImage.push('latest')
              }
            }
          }
	   }

       stage('Kubernetes Deploy Angular') {
           when { changeset "client/*"}
            steps {
                  withCredentials([file(credentialsId: 'CartWheelKubeConfig1', variable: 'config')]){
                    sh """
                      export KUBECONFIG=\${config}
                      pwd
                      helm upgrade kubekart kkartchart --install --set "kkartcharts-frontend.image.client.tag=${BUILD_NUMBER}" --namespace kart
                      """
                  }
                 }  
        }

        stage('Build books Image') {
        when { changeset "javaapi/*"}
	     steps {
		   
		     script {
                dockerImage = docker.build( booksRegistry + ":$BUILD_NUMBER", "./javaapi/")
             }

		 }
	  
	  }
	  
	  stage('Deploy books Image') {
          when { changeset "javaapi/*"}
          steps{
            script {
              docker.withRegistry( cartRegistry, registryCredential ) {
                dockerImage.push("$BUILD_NUMBER")
                dockerImage.push('latest')
              }
            }
          }
	   }

       stage('Kubernetes books Deploy') {
           when { changeset "javaapi/*"}
            steps {
                  withCredentials([file(credentialsId: 'CartWheelKubeConfig1', variable: 'config')]){
                    sh """
                      export KUBECONFIG=\${config}
                      pwd
                      helm upgrade kubekart kkartchart --install --set "kkartcharts-backend.image.books.tag=${BUILD_NUMBER}" --namespace kart
                      """
                  }
                 }  
        }

        stage('Build Main Image') {
        when { changeset "nodeapi/*"}
	     steps {
		   
		     script {
                sh " sed -i 's/localhost/emongo/g' nodeapi/config/keys.js"
                dockerImage = docker.build( mainRegistry + ":$BUILD_NUMBER", "./nodeapi/")
             }

		 }
	  
	  }
	  
	  stage('Deploy Main Image') {
          when { changeset "nodeapi/*"}
          steps{
            script {
              docker.withRegistry( cartRegistry, registryCredential ) {
                dockerImage.push("$BUILD_NUMBER")
                dockerImage.push('latest')
              }
            }
          }
	   }

       stage('Kubernetes Main Deploy') {
           when { changeset "nodeapi/*"}
            steps {
                  withCredentials([file(credentialsId: 'CartWheelKubeConfig1', variable: 'config')]){
                    sh """
                      export KUBECONFIG=\${config}
                      pwd
                      helm upgrade kubekart kkartchart --install --set "kkartcharts-backend.image.main.tag=${BUILD_NUMBER}" --namespace kart
                      """
                  }
                 }  
        }
	}
}
