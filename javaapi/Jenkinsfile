pipeline {
    agent any
	
	environment {
        registry = "repository.k8sengineers.com/apexrepo/main"
        registryCredential = 'NexusRepoLogin'
        cartRegistry = "https://repository.k8sengineers.com"
    }
	
	stages {
	
	  stage('Build Image') {
	     steps {
		   
		     script {
                dockerImage = docker.build( registry + ":$BUILD_NUMBER", "./javaapi/")
             }

		 }
	  
	  }
	  
	  stage('Deploy Image') {
          steps{
            script {
              docker.withRegistry( cartRegistry, registryCredential ) {
                dockerImage.push("$BUILD_NUMBER")
                dockerImage.push('latest')
              }
            }
          }
	   }

       stage('Kubernetes Deploy') {
            steps {
                  withCredentials([file(credentialsId: 'CartWheelKubeConfig1', variable: 'config')]){
                    sh """
                      export KUBECONFIG=\${config}
                      pwd
                      helm upgrade kubekart kkartchart --install --set kkartchart-backend.image.client.repository=${registry}:${BUILD_NUMBER} --namespace kart
                      """
                  }
                 }  
            }
	}
}
