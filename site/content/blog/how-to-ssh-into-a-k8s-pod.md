---
title: How to SSH Into a K8s Pod
slug: how-to-ssh-into-pod-k8s
date: 2022-12-23 
hero: 
    path: /images/k8s-ssh-pod.jpg
    width: 1920
    height: 800
categories:
    - DevOps
published: true
author: Geoff Wagner
toc: true
faq:
    -
        question: How do I get SSH access to a k8s pod?
        answer: |
            To get SSH access to a Kubernetes (k8s) pod, you'll need to do the following:

            1. **Make sure that the pod has an SSH server running inside it.** This typically involves installing and running an SSH daemon sshd inside the container.
            1. **Expose the pod's SSH service to the network.** This can be done by creating a Kubernetes Service object that exposes the pod's SSH port (usually port 22) to the cluster. Alternatively, you can use a tool like kubectl port-forward to forward traffic from a local port to the pod's SSH port.
            1. **Connect to the pod's SSH service using an SSH client.** You'll need to know the pod's IP address or hostname, as well as any authentication credentials required to log in.

            It's worth noting that SSH access to a k8s pod is not the recommended way to access and manage a pod. Instead, it's generally better to use the k8s API and tools like kubectl to interact with and manage your pods.
            Is it possible to SSH into a k8s pod?

            Yes, it is possible to SSH into a Kubernetes (k8s) pod, as long as the pod has an SSH server running inside it and the pod's SSH service is exposed to the network.
            
    -
        question: How do I troubleshoot connectivity issues when trying to SSH into a k8s pod?
        answer: | 
            If you're having connectivity issues when trying to SSH into a Kubernetes (k8s) pod, here are some steps you can take to troubleshoot the problem:

            1. **Check the pod's status:** Make sure that the pod is running and ready. If the pod is not running or is in a failed state, you won't be able to SSH into it. You can use the kubectl get pods command to check the status of your pods.
            1. **Check the pod's IP address:** Make sure that you have the correct IP address or hostname for the pod. You can use the kubectl describe pod command to get the IP address of a pod.
            1. **Check the pod's SSH port:** Make sure that you're trying to connect to the correct SSH port on the pod. The default SSH port is 22, but it's possible that the pod's SSH service is listening on a different port.
            1. **Check the pod's network connectivity:** Make sure that the pod has network connectivity and that there are no network issues or firewalls blocking the connection. You can use the kubectl exec command to run a command inside the pod and verify that it has network connectivity.
            1. **Check the pod's SSH service:** Make sure that the pod's SSH service is running and accessible. You can use the kubectl exec command to run a command inside the pod and check the status of the SSH service.
            1. **Check your SSH client and configuration:** Make sure that your SSH client is configured correctly and that you're using the correct authentication credentials.
            1. **Check the pod's logs:** You can use the kubectl logs command to view the pod's logs, which may contain clues about the cause of the connectivity issues.

            It's worth noting that SSH access to a k8s pod is not the recommended way to access and manage a pod. Instead, it's generally better to use the k8s API and tools like kubectl to interact with and manage your pods.

    - 
        question: Can I use a private key to authenticate when SSHing into a k8s pod?
        answer: Yes, you can use a private key to authenticate when SSHing into a Kubernetes (k8s) pod. This is typically done by creating a key pair (consisting of a private key and a public key) and installing the public key on the pod. The private key is then used to authenticate the connection when you SSH into the pod.

    -
        question: Is it possible to use a bastion host to SSH into a k8s pod?
        answer: Yes, it is possible to use a bastion host to SSH into a Kubernetes (k8s) pod. A bastion host is a secure, remote server that acts as a gateway or jump host for accessing other servers on a network. By connecting to the bastion host first, you can then use the bastion host to SSH into the k8s pod, which can be useful for security or convenience reasons.

    - 
        question: Can I use a tool like Ansible to manage SSH access to k8s pods?
        answer: Yes, you can, but this is so far off the beaten path of how you should be managing a Kubernetes (k8s) cluster that I would highly recommend going back and reviewing all of your design decisions to ask yourself “Why??”

---

Taking the paradigm shift from running applications on servers to running them in containers is quite the mental jump. The technology industry has spent the last 50 years creating technology to accelerate on top of servers whether they are physical or virtual.

Containers showed up on the scene in 2013, though the mechanics for containers had been showing up in the Linux kernel earlier than that. The adoption of containers has been steady but has also been slow over time.

Kubernetes was released in 2015 and has greatly accelerated container adoption in the industry. Because of Kubernetes' close ties with DevOps, and the rapid adoption of DevOps, nearly everyone in the technology space has had to rapidly pick up and try to make sense of this paradigm shift.

An activity that any systems administrator has performed is the remote administration of a server. On Linux, there will be an exchange of key files, and an SSH connection is established to an internal or external IP address, and boom you are in!

How do you remotely administer a container running in a Kubernetes cluster? Let's explore that question below!

## What is a Container Runtime?

A container runtime is a software component that is responsible for executing and managing containers on a host. It provides the necessary infrastructure to launch and manage containers, including creating and destroying containers, allocating resources to containers, and providing networking and storage services to containers.

There are several different container runtime implementations available, including Docker, ContainerD, and CRI-O. These runtime implementations are typically used in conjunction with a container orchestration platform, such as Kubernetes, to manage the deployment and scaling of containers in a distributed environment.

In general, a container runtime is responsible for the low-level management of containers, including tasks such as starting and stopping containers, providing isolation between containers, and managing resource allocation for containers. The container orchestration platform, on the other hand, is responsible for higher-level tasks such as scheduling containers across multiple hosts, ensuring that the desired number of replicas of a container is running, and providing load balancing and networking services for containers.

## How Does a Container Work?

Containers are a way to package and distribute applications and their dependencies in a lightweight and portable way. They allow developers to build and deploy applications that can run consistently across different environments, such as developer laptops, staging servers, and production environments.

Containers work by using the operating system's kernel to allow multiple isolated user-space instances, or containers, to run on a single host. Each container shares the host's kernel but has its own user space, which includes the libraries, system tools, and application code needed to run the application.

When a container is created, it is based on a container image, which is a lightweight, stand-alone, and executable package that includes everything needed to run the application, including the application code, libraries, system tools, and runtime. The container image is built from a set of instructions called a Dockerfile, which specifies the steps needed to create the image.

To run a container, you can use a container runtime, such as Docker, to start the container based on the container image. The container runtime creates a new container instance and allocates the necessary resources, such as CPU, memory, and storage, to the container. The container runtime then launches the application inside the container and provides it with the necessary networking and storage services.

## How Do I SSH Into a Running Container?

The short answer is this; unless the container is running an SSH server with a port mapped to a service, you don't. The right question to ask is “How do I access a running Container or Pod's Shell?” That question is answered in another section down below.

A container is essentially carved out of user space from the operating system's kernel which is running one or more processes in isolation. When you SSH into a server, that server is running a process like OpenSSH to facilitate your connection and login. If your containers are not running an OpenSSH server as a process, then SSHing is not the answer.

What you are really trying to do is start up a new process inside of the container which provides you with a running TTY Shell.

## How Do I access a running Container or Pod's Shell?

To SSH into a pod, or more correctly stated “gain terminal access into a pod”, in Kubernetes, you can use the kubectl exec command. This command allows you to execute a command in a specific container within a pod.

Here is an example of how to use kubectl exec to SSH into a pod:

{{< code-highlight "language-shell" >}}
kubectl exec -it -n <namespace> <pod-name> -- /bin/bash
{{< /code-highlight >}}

This will open a shell inside the container of the pod. You can then use the ssh command to connect to another server from within the container. If your pods do not have `/bin/bash` on them, then you can try something like `/bin/sh` or `/bin/zsh`.

Keep in mind that the pod must be running in order for you to be able to exec into it. If the pod is not running, you will need to start it before you can exec into it.

You can also use the kubectl exec command to execute other commands in the container, such as running scripts or checking the status of processes.

## Caveats for accessing Container or Pod's Shell

### Scratch Container

A scratch container is a special type of container image that is built from scratch, without any base image. It is used as a starting point for building other container images, and typically includes only the bare minimum required to run a container, such as the operating system kernel and the init process.

Scratch containers are useful when you need to build a container image that is as lightweight as possible, or when you want to start with a completely blank slate and build up your container image from the ground up. They can also be useful when you want to build a container image that includes only the specific tools and dependencies that your application requires, rather than relying on a larger base image that might include unnecessary packages.

To use a scratch container, you can specify it as the base image when building your container image using a tool such as Docker. For example, the following Dockerfile uses a scratch container as the base image:

{{< code-highlight "language-dockerfile" >}}
FROM scratch
COPY my-app /
CMD ["/my-app"]
{{< /code-highlight >}}

This Dockerfile will build a container image that includes only the my-app binary, without any other packages or dependencies.

If the base of the container you are running is “scratch” then you will not have a shell installed on that container unless you explicitly add one as part of the build process.

### Missing Shell or Command Language Interpreter

A shell, or command language interpreter, is a software program that provides a command-line interface for interacting with an operating system. It allows users to execute commands and run programs by typing them into a terminal window or console.

The shell acts as an intermediary between the user and the operating system, taking input from the user, executing the requested commands, and displaying the results. It also provides a set of built-in commands and functions for performing common tasks, such as navigating the file system, managing files and directories, and launching programs.

There are many different shells available for different operating systems, each with its own unique syntax and features. Some common shells include the Bourne shell (sh), the C shell (csh), the Korn shell (ksh), and the Bourne-Again shell (bash).

In addition to providing a command-line interface, shells can also be used to write scripts that automate tasks and processes. These scripts, called shell scripts, are written in the syntax of the shell and can be executed from the command line or triggered by certain events.

If the base of the container you are running is “scratch” then you will not have a shell installed on that container unless you explicitly add one as part of the build process. The container you are running may also be limited to something like /bin/sh and may not have your favorite shell such as fish installed.
The Container is not Running

If your container is not running, you may not be able to exec in to get a shell. You may need to spin up an out-of-band pod that does not fail so that you can get in and review things like env vars or connection params. Below is how Kubernetes recommends you do this with their DNS debug container.

The DNS debug container is a tool that can be used to troubleshoot issues with DNS resolution in a Kubernetes cluster. It is a special container image that includes a number of utilities for diagnosing DNS problems, such as dig, nslookup, and host.

To use the DNS debug container in Kubernetes, you will need to create a pod that runs the container. You can do this using the kubectl command-line tool and a manifest file that specifies the pod's configuration.

Here is an example manifest file that creates a pod with the DNS debug container:

{{< code-highlight "language-yaml" >}}
apiVersion: v1
kind: Pod
metadata:
    name: dns-debug
spec:
    containers:
    - name: dns-debug
        image: k8s.gcr.io/dns-debug:1.16.7
{{< /code-highlight >}}

To create the pod, save the manifest file and then run the following command:

{{< code-highlight "language-shell" >}}
kubectl apply -f manifest.yaml
{{< /code-highlight >}}

Once the pod is created, you can use kubectl exec to connect to the pod and run the DNS debugging utilities. For example, to run dig, you can use the following command:

{{< code-highlight "language-shell" >}}
kubectl exec dns-debug -it -- dig example.com
{{< /code-highlight >}}

This will execute the dig command inside the DNS debug container, allowing you to troubleshoot DNS issues in your cluster.

## Frequently Asked Questions

Below are some frequently asked questions relating to SSHing (or gaining access) to a k8s pod:

{{< faq >}}

## Conclusion

The answer to the question ‘How to SSH into pod K8s' is simply, you don't. What you are really looking to do is exec a Command Language Interpreter, or shell, inside of a running container.