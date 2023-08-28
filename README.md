# PodChaosMonkey
A deployable Kubernetes application that randomly deletes pods in a `workloads` namespace.

## Running the application
This application requires a kubernetes cluster, and has been tested using `v1.27.3` and a local kubernetes cluster using kind.  
Get cluster logs:
`kind export logs C:\Users\seana\kubelogs --name=my-cluster`

