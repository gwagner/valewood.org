---
title: Solving the 'This Combination of Host and Port Requires TLS' Error in Kubernetes
slug: /kubernetes-port-requires-tls/
date: 2022-12-21 
hero: 
    path: /images/kubernetes-port-requires-tls.jpg
    width: 1920
    height: 800
    alt: Solving the 'This Combination of Host and Port Requires TLS' Error in Kubernetes
categories:
    - Kubernetes
    - DevOps
published: true
author: Geoff Wagner
toc: true
published: true
---

Kubernetes is a powerful container orchestration platform that enables users to deploy, manage, and scale applications quickly and easily. It has gained a lot of favor in the DevOps community for its ability to be highly automated. Unfortunately, like any other software, it can sometimes present cryptic errors which are hard to debug.

One such error is the "This combination of host and port requires TLS" error.

In this blog, we'll explore what this error is, what causes it, and how to troubleshoot and fix it. We'll also discuss some tips for avoiding this error and common mistakes to avoid when dealing with it. Lastly, we'll look at some Kubernetes best practices for avoiding this error.

{{< googleads >}}

## What is the 'This Combination of Host and Port Requires TLS' error?

The "This combination of host and port requires TLS" error is an error in Kubernetes that occurs when a user attempts to connect to a cluster without using a secure protocol such as Transport Layer Security (TLS). It is a common error that is seen in Kubernetes clusters and is usually caused by misconfigured network settings or incorrect authentication credentials.

The error looks something like this:

> Error: This combination of host and port requires TLS

The "This combination of host and port requires TLS" error is a type of TLS handshake error. TLS is a cryptographic protocol that is used to secure communications between two entities. It is a vital part of any secure network, and thus it is important to ensure that TLS is enabled and configured properly in order to avoid this error.

## What causes the 'This Combination of Host and Port Requires TLS' error?

The "This combination of host and port requires TLS" error is usually caused by one of three things: an incorrect network configuration, an incorrect authentication configuration, connecting to a secure service via HTTP instead of HTTPS, or a missing or incorrect TLS certificate.

**Incorrect network configurations** can cause this error if the user is attempting to connect to the wrong host or port. This can happen if the user has mistakenly entered the wrong IP address or hostname, or if the user has entered the wrong port number. It is also possible that the user has misconfigured the network settings, such as a firewall or a proxy, which can prevent the user from connecting to the cluster.

**Incorrect authentication configurations** can also cause this error. If the user's credentials are incorrect, then the user will not be able to connect to the cluster. This can happen if the user has entered the wrong username or password, or if the user has not set up authentication correctly.

**Connecting to a secure service via HTTP instead of HTTPS** can also cause this error to be displayed. Since Kubernetes services are a mapping between a load-balanced IP address and a running pod and Kubernetes can do this mapping on almost any port, your cluster is attempting to provide a helpful message telling you that the port you have configured only negotiates encrypted traffic transports.

Finally, a **missing or incorrect TLS certificate** can also cause this error. TLS certificates are used to authenticate a user and allow them to connect to the cluster. Certificates are also used to perform end-to-end encryption between a user and a Kubernetes service. If the TLS certificate is missing or incorrect, then the user will not be able to connect to the cluster.

## How to troubleshoot the 'This Combination of Host and Port Requires TLS' error

The first step in troubleshooting the "This combination of host and port requires TLS" error is to check the network configuration. Make sure that the user has entered the correct IP address or hostname, as well as the correct port number. Additionally, check to make sure that all of the network settings, such as firewalls and proxies, are configured properly.

The next step is to check the use of HTTPS versus HTTP in the URL being requested from the Kubernetes cluster. If your service is set up to utilize a certificate, but the request you are making is HTTP, then this error message will be returned.

Finally, check the TLS certificate. Make sure that the TLS certificate is present and that it is valid. If the TLS certificate is missing or incorrect, then the user will not be able to connect to the cluster.

Below are a few different reference examples of how you can configure Kubernetes to utilize SSL certificates on your cluster. The exact configuration will depend on your specific requirements and the characteristics of your environment.

### Reference Service Definition

Here is an example Kubernetes service configuration that utilizes TLS certificates:

{{< code-highlight "language-yaml" >}}
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - name: https
      port: 443
      targetPort: 8443
      protocol: TCP
  loadBalancerSourceRanges:
    - 0.0.0.0/0
  externalTrafficPolicy: Local
  sessionAffinity: ClientIP
  tls:
    - secretName: my-tls-certs
      termination: edge
{{< /code-highlight >}}

This configuration defines a Kubernetes service called "my-service" that exposes port 443 to external traffic and directs it to port 8443 on the pods in the "my-app" deployment. It also specifies a TLS secret called "my-tls-certs" that contains the necessary certificates and keys for establishing a secure connection. The termination field is set to edge, which means that the service will terminate TLS at the edge of the cluster.

### Reference Ingress NGINX Definition

Here is an example Kubernetes Ingress configuration that utilizes TLS certificates with NGINX:

{{< code-highlight "language-yaml" >}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - secretName: my-tls-certs
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: my-service
          servicePort: 443
{{< /code-highlight >}}

This configuration defines an Ingress resource called "my-ingress" that routes incoming traffic to the "my-service" service on port 443. It also specifies a TLS secret called "my-tls-certs" that contains the necessary certificates and keys for establishing a secure connection. The [nginx.ingress.kubernetes.io/ssl-redirect](http://nginx.ingress.kubernetes.io/ssl-redirect) annotation tells NGINX to redirect all HTTP traffic to HTTPS.

{{< googleads >}}

## How to fix the 'This Combination of Host and Port Requires TLS' error

To fix the "This Combination of Host and Port Requires TLS" error in Kubernetes, you will need to ensure that TLS is correctly configured for the host and port combination you are trying to access. Here are the steps you can take to do this:

1.  **Confirm that TLS is required:** Make sure that the service you are trying to access requires TLS. If it does not, then the error may be caused by a misconfiguration or a typo in your configuration.
2.  **Check your TLS configuration:** Review your TLS configuration to ensure that it is correct and complete. This includes verifying that you have the necessary certificates and keys and that you have specified the correct host and port in your configuration.
3.  **Use the correct host and port combination:** Make sure that you are using the correct host and port combination in your configuration. If you are not sure what the correct combination is, you can consult the documentation for the service you are trying to access.
4.  **Use the correct protocol:** Make sure that you are using the correct protocol (e.g. HTTPS) when accessing the service.
5.  **Check for typos:** Check your configuration for typos or other mistakes that may be causing the error.
6.  **Restart affected services:** If you have recently made changes to your TLS configuration, try restarting the affected services to see if that resolves the error.
7.  **Consult the documentation:** If you are still having trouble, consult the documentation for the service you are trying to access, as well as the documentation for Kubernetes and TLS, to see if there are any additional troubleshooting tips or requirements you need to be aware of.

By following these steps, you should be able to resolve the "This Combination of Host and Port Requires TLS" error and successfully access the service.

## Tips for avoiding the 'This Combination of Host and Port Requires TLS' error message

1.  **Configure TLS correctly:** Make sure that you have correctly configured TLS for your host and port combination. This includes setting up the necessary certificates and keys and specifying the correct host and port in your TLS configuration.
2.  **Use the correct host and port combination:** Double-check that you are using the correct host and port combination in your configuration. If you are not sure what the correct combination is, you can consult the documentation for the service you are trying to access.
3.  **Use the correct protocol:** Make sure that you are using the correct protocol (e.g. HTTPS) when accessing the service.
4.  **Check for typos:** Check your configuration for typos or other mistakes that may be causing the error.
5.  **Use a linting tool:** There are several linting tools specifically designed for linting Kubernetes configurations, such as kube-linter, kubeval, and conftest. These tools can check your configurations for common mistakes, syntax errors, and best practices violations.
6.  **Use the Kubernetes API server:** You can use the Kubernetes API server to validate your configurations by sending them to the server and checking for errors. To do this, you can use the `kubectl create` or `kubectl apply` commands with the `--dry-run` flag, which will send your configurations to the API server for validation without actually creating any resources.
7.  **Use a configuration management tool:** Configuration management tools like Helm, [Ansible](https://www.ansible.com/ "Ansible"), and Terraform have built-in linting functionality that can check your Kubernetes configurations for errors and best practices violations.
8.  **Consult the documentation:** If you are still having trouble, consult the documentation for the service you are trying to access, as well as the documentation for Kubernetes and TLS, to see if there are any additional troubleshooting tips or requirements you need to be aware of.

{{< googleads >}}

## Conclusion

In conclusion, the "This combination of host and port requires TLS" error is an error in Kubernetes that occurs when a user attempts to connect to a cluster without using a secure protocol such as TLS. This error can be caused by an incorrect network configuration, an incorrect authentication configuration, or a missing or incorrect TLS certificate. In order to troubleshoot and fix this error, the user should check the network configuration, the authentication configuration, and the TLS certificate. Additionally, there are several tips for avoiding this error as well as some common mistakes to avoid when dealing with it. Lastly, Kubernetes provides several best practices for avoiding this error.