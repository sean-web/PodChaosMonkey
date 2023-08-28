# PodChaosMonkey
A deployable Kubernetes application that randomly deletes pods in a `workloads` namespace.

## Running the application
This application requires a Kubernetes cluster, tested using a local `v1.27.3` Kubernetes cluster using [kind](https://kind.sigs.k8s.io/).

**To deploy the application on a Kubernetes cluster:**
1. Clone this repo, or download the [deploy-chaos-monkey](https://github.com/sean-web/PodChaosMonkey/blob/main/kubernetes/deploy-chaos-monkey.yaml) file at a minimum.
2. when connected to a cluster, run the following command:

 ```kubectl apply -f [path-to-file]\deploy-chaos-monkey.yaml```

 This will deploy the following resources:
 - A `Namespace` named `workloads` where the application will run
 - A `Role` called `chaos monkey` that has permission to get, list, and delete pods
 - A `RoleBinding` that binds the `chaos monkey` role to the `workloads` service account
 - A `Deployment` that creates a dummy workload, deploying 5 pods running the docker [hello-world image](https://hub.docker.com/_/hello-world).
 - A `Deployment` that creates a pod with a container running the `chaos-monkey` application.

Each of these resources can be deployed on their own using their standalone yaml files.

Once the `chaos-monkey` pod is running, it will delete one of the `hello-world` pods at random every 10 seconds.

To remove all the above resources, run the following command:

```kubectl delete -f [path-to-file]\deploy-chaos-monkey.yaml```

## Developing the application
This application requires node `v18` to run.

**To run this application locally**:
1. Clone this repository
2. Run `npm i` to install all required dependencies
3. Run `npm start` to start the application on your machine

**To run tests**:

Run the command `npm test`.

This will run the jest tests as well as run [standard](https://standardjs.com/) against the code to maintain a consistent coding style.

