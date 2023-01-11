---
title: How ChatGPT Can Speed Up DevOps by Writing Ansible
slug: /how-chatgpt-can-speed-up-devops-by-writing-ansible/
date: 2022-12-14
hero: 
    path: /images/chatgpt-devops-ansible.jpg
    width: 1920
    height: 800
categories:
    - DevOps
published: true
author: Geoff Wagner
toc: true
published: true
---


Did you know that ChatGPT can help you write Ansible? ChatGPT utilizes the same OpenAI that GitHub Copilot uses to generate code on the fly in your favorite IDE or code editor. You can ask ChatGPT questions about how to write code, and to the best of its ability, it will send back an answer that is usually pretty good. This is especially useful when writing automation as part of a team focused on the DevOps methodology.

In DevOps you will be hit with many unfamiliar and abstract contexts simply because the space is rapidly evolving and new stuff is being introduced daily. ChatGPT is trained on information up to 2021, so you will not get anything up the minute, but there are already a lot of problems that have been solved on the internet, but searching for them may be problematic.

ChatGPT is really good, almost scary, at understanding your request and returning working code examples for you to consume. Better yet, it is excellent at also providing descriptions about the code it just wrote to help you understand it using natural language.

Let’s talk about the good, the bad, and the ugly side of AI-generated code and how to use chat GPT to write some Ansible!

{{< googleads >}}

## The Good: Asking ChatGPT to Create an ESXi Virtual Machine with Ansible

I posted an article a few months back about the flow that I use to [create an ESXi virtual machine](https://www.lab.valewood.org/ansible-create-vmware-esxi-vm/) using native ansible. This example comes directly from my home lab setup where I have automated a complete end-to-end Kubernetes deployment utilizing Ansible and kubespray. This bit of code was extracted and abstracted to provide that example on my website.

Let’s see if ChatGPT could answer the question:

> Using Ansible, how would i create a virtual machine in ESXi?

And here is the response that I got back:

> To create a virtual machine in ESXi using Ansible, you would need to use the `vmware_guest` module. This module allows you to manage virtual machines in VMware vSphere.
>
> Here is an example of how you can use this module to create a new virtual machine:
>{{< code-highlight "language-shell" >}}
- name: Create a new virtual machine
  vmware_guest:
    hostname: "{{ vsphere_hostname }}"
    username: "{{ vsphere_username }}"
    password: "{{ vsphere_password }}"
    datacenter: "{{ datacenter_name }}"
    cluster: "{{ cluster_name }}"
    name: "{{ vm_name }}"
    folders: "{{ folder_name }}"
    template: "{{ template_name }}"
    state: present
    networks:
    - name: "{{ network_name }}"
      ip: "{{ ip_address }}"
      netmask: "{{ netmask }}"
      gateway: "{{ gateway }}"
      domain: "{{ domain_name }}"
{{< /code-highlight >}}
>
> In the above example, we are creating a new virtual machine with the specified `name` and `template` on the specified `datacenter` and `cluster`. We are also specifying the network settings for the virtual machine, such as the `ip` address, `netmask`, and `gateway`.
>
> Keep in mind that this is just an example, and you may need to adjust the parameters and settings based on your specific environment and requirements.

This is an excellent example of how to perform this task. If you search google for this exact same search query “Using Ansible, how would I create a virtual machine in ESXi?”, the first thing that you get is some obscure ansible documentation that does not really answer the question you were after. ChatGPT understood exactly what I was looking for and returned a good relevant explanation along with code and a description of variables that you need to define to utilize this code.

Now; ChatGPT is not connected to the internet, or so they claim, so you are unable to ask it for references to relevant documentation, but anyone savvy enough to read this should be able to utilize the provided code to perform a much more detailed search on google to hone in on what they want.

### Extending the Search

I went back to ChatGPT to ask:

> How would I integrate that utilizing an existing disk image?

Unfortunately, ChatGPT returned the exact same response as it did to my original question. This is going to be where ChatGPT will fall short. The example code that I linked above assumes that you have an existing disk image that you are looking to copy and register as a new virtual machine. ChatGPT, using OpenAI v3, won’t really be able to contextually understand that use case today, but might in the future!

### How else could I use this?

I asked ChatGPT this question next:

> How would I do that with GoLang?

Please take note, I have not asked any other questions than what I have put in this thread. ChatGPT is contextually understanding the conversation that we are having and is deriving its responses based on that context. This means that it still knows that I am trying to clone out an ESXi virtual machine even though that was 2 messages back.

Here is the response that I got back:

> To create an ESXi virtual machine using GoLang, you would need to use the vSphere API provided by VMware. The vSphere API allows you to manage and interact with ESXi hosts and their virtual machines.
>
> Here is an outline of the steps you would need to follow to create an ESXi virtual machine using GoLang:
>
> 1.  Install and configure the GoLang programming language on your computer.
> 2.  Use the vSphere API to connect to your ESXi host and authenticate with the host.
> 3.  Use the vSphere API to create a new virtual machine on the ESXi host. This will involve specifying the hardware configuration for the virtual machine, such as the amount of memory and CPU resources to allocate, as well as the virtual disk size and format.
> 4.  Use the vSphere API to configure the network settings for the virtual machine, such as the network adapter type and network settings.
> 5.  Use the vSphere API to install an operating system on the virtual machine. This will involve booting the virtual machine from an ISO image and installing the operating system according to the instructions provided by the operating system vendor.
> 6.  Use the vSphere API to start the virtual machine and verify that it is running correctly.
>
> Overall, creating an ESXi virtual machine using GoLang will require a good understanding of both the GoLang programming language and the vSphere API. It may also require some knowledge of virtualization and ESXi host management.

This response is interesting. With the Ansible response, code was provided. With the GoLang response, steps were provided. This shows a bit of the inconsistency still left to shake out of the system.

I pivoted a bit and asked:

> How would I do this with Code?

And the response looks much better!

> Here is an example of how you might use the vSphere API in GoLang to create a new virtual machine on an ESXi host:
>{{< code-highlight "language-shell" >}}
import "github.com/vmware/govmomi/vim25/types" // Import the vSphere API package

// Connect to the ESXi host and authenticate
client, err := govmomi.NewClient(ctx, esxiURL, true)
if err != nil {
    // Handle error
}

// Create a new virtual machine on the ESXi host
vm, err := object.NewVirtualMachine(client.Client, vmConfig)
if err != nil {
    // Handle error
}

// Configure the virtual machine's hardware settings
err = vm.WaitForIP(ctx)
if err != nil {
    // Handle error
}

// Install an operating system on the virtual machine
err = vm.Create(ctx, pool, spec)
if err != nil {
    // Handle error
}

// Start the virtual machine and verify that it is running
err = vm.PowerOn(ctx)
if err != nil {
    // Handle error
}
{{< /code-highlight >}}
>
> This is just an example of how you might use the vSphere API in GoLang to create an ESXi virtual machine. There may be other ways to accomplish this task using the vSphere API, and your specific implementation may vary depending on your specific requirements and use case. I recommend consulting the vSphere API documentation and GoLang documentation for more information and guidance.

Pretty impressive that you can get 2 different results for the same tasks in different programming languages all provided by the same AI language model. Now this response is extremely basic and I would not run it in production anywhere without a lot more inspection and real error handling, but it is perfect to get someone going in a space they are unfamiliar with!

{{< googleads >}}

## The Bad: Asking ChatGPT to Convert Text to JSON with Ansible

Things here get a little bit messier. I have an article [here](https://www.lab.valewood.org/ansible-text-to-json/) to help people understand how to convert a text file to JSON using ansible. This post was inspired by someone asking the exact same question over on Reddit, and rather than answering it there, I figured it was a good opportunity to write something a bit more long-form that was easier to find that an obscure Reddit thread.

Let’s see if ChatGPT could answer this relatively simple question on doing the exact same conversion.

> Using Ansible, how would i convert a text file to JSON and write it to a new file?

And here is the response that I got back:

> To convert a text file to JSON using Ansible, you can use the `json_query` filter to extract the desired data from the text file and then use the `to_json` filter to convert it to JSON format. You can then use the `file` module to write the JSON data to a new file.
>
> Here is an example playbook that shows how this can be done:
>{{< code-highlight "language-shell" >}}
---
- hosts: localhost
  tasks:
    - name: Read the text file
      delegate_to: localhost
      slurp:
        src: "path/to/text/file"
      register: text_file

    - name: Convert the text file to JSON
      delegate_to: localhost
      set_fact:
        json_data: "{{ text_file.content | json_query(query) | to_json }}"

    - name: Write the JSON data to a new file
      delegate_to: localhost
      file:
        path: "path/to/new/file.json"
        mode: "0644"
        state: "touch"
        content: "{{ json_data }}"

{{< /code-highlight >}}
>
> In this example, the `json_query` filter is used to extract the desired data from the text file using the `query` variable. You can use any valid JSON query to extract the data you need. The extracted data is then converted to JSON format using the `to_json` filter and saved in a variable called `json_data`.
>
> Finally, the `file` module is used to create a new file called `file.json` and write the JSON data to it. You can customize the path, permissions, and other attributes of the file as needed.

Pretty neat! Breaking this down a bit, ChatGPT first provides a text-based description of what it is going to do. The problem is, `query` is currently not a defined variable meaning that this code is not actually going to run.

Structurally, this code looks awesome and looks fully functional, but in the end, is not a good representation of a working Ansible that will actually produce the result you are looking for. If you are looking for a more correct example, please follow the link that I provided above.

{{< googleads >}}

## The Ugly: The Evolving Landscape

Right now ChatGPT is a bit slow to respond and is very popular meaning that it is overloaded frequently. There is also no guarantee that ChatGPT will remain free and open forever. It is currently pulling from a dataset that is powering a paid product called GitHub CoPilot meaning that OpenAI has the incentive to lock this functionality down in the future.

While working on this piece, I had to put things down and come back the next day to finish up. I decided to run a few questions against ChatGPT again to see what kind of response I would get. The reality is, they had changed. ChatGPT engineers are constantly doing training tweaks to the AI to better respond to requests, meaning you will get different responses each time you use it.

I think that this is a very fun toy while it lasts, but I would not consider wrapping this into any kind of mission-critical environment just yet. But, if you are an aspiring engineer that is having trouble sourcing any kind of kickstart material, or you are just curious, ride this train while the ride is free!