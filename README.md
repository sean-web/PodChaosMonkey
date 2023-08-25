# PodChaosMonkey

Get cluster logs:
`kind export logs C:\Users\seana\kubelogs --name=my-cluster`

After creating the roleBinding, run the following command:
`kubectl create clusterrolebinding chaos-monkey-workloads --clusterrole=chaos-monkey --serviceaccount=workloads:default`