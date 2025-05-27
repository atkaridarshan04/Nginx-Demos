# Nginx Directives and Contexts

## Overview
Nginx configuration is structured using **directives** and **contexts**, providing flexibility to define how the server operates.

---

## Directives
Directives are the instructions or commands in the Nginx configuration file. Each directive tells Nginx what action to perform or how to behave.  

---

## Contexts
Contexts group related directives and apply them to specific parts of the configuration. Common contexts include:

- **`http`**: Used for directives related to HTTP traffic.
- **`server`**: Defines server-specific configurations for handling client requests.
- **`location`**: Specifies routing behavior for specific request URIs or patterns.

---

## Key Directives and Their Purpose

### 1. **Worker Processes**
- **Purpose**: Controls how many parallel processes Nginx spawns to handle client requests. 
- **How It Works**: Nginx uses worker processes, each capable of managing many connections with a single-threaded event loop.

#### **Configuration**
```nginx
worker_processes <number>;
```

- **What the Number Represents**:  
  - The number of worker processes Nginx should create.  
  - Each process operates independently and handles its own connections.  

- **Performance Impact**:  
  - A higher number can improve traffic handling but must match the server's hardware.  
  - Recommended value in production: **Number of CPUs = Number of worker processes.**

---

### 2. **Worker Connections**
- **Purpose**: Specifies the maximum number of simultaneous connections each worker process can handle.  
- **Default**: 512 connections per worker process.  

#### **Configuration**
```nginx
worker_connections <number>;
```

- **Example**: If there are 4 worker processes and each can handle 512 connections, the server can theoretically handle 2048 connections concurrently.

---

### 3. **Server Block**
Defines how Nginx should handle requests for a specific domain or IP address.

#### **Key Directives in a Server Block**
1. **`listen`**:  
   - Specifies the IP address and port on which the server accepts requests.  
   ```nginx
   listen 80; # Listen on port 80 (HTTP)
   listen 443 ssl; # Listen on port 443 (HTTPS)
   ```

2. **`server_name`**:  
   - Defines the domain(s) or IP address(es) that the server block should respond to.  
   ```nginx
   server_name example.com www.example.com;
   ```

3. **`location`**:  
   - Defines how requests matching a specific URI or pattern are routed.  

   #### **Example**
   ```nginx
   location / {
       root /var/www/html;
       index index.html;
   }
   ```

---

## Advanced Configurations

### **Location Block**
- Used to define specific behaviors for certain URIs or routes.  


### 1. **`proxy_pass`**
- **Purpose**: Forwards client requests to another server (reverse proxy).
- **Example**:
  ```nginx
  location / {
      proxy_pass http://nodejs_servers;
  }
  ```
- **How It Works**: Routes incoming requests to the backend servers defined in an `upstream` block.

---

### 2. **`proxy_set_header`**
- **Purpose**: Customizes HTTP headers sent to the upstream server.
- **Examples**:
  - **`Host`**: Passes the original host header to the backend server.
    ```nginx
    proxy_set_header Host $host;
    ```
  - **`X-Real-IP`**: Passes the real client IP to the backend server.
    ```nginx
    proxy_set_header X-Real-IP $remote_addr;
    ```

---

### How They Work Together:
- **`proxy_pass`** forwards client requests, and **`proxy_set_header`** ensures necessary headers (like client IP or host) are passed correctly to the backend servers. This is crucial for maintaining accurate client information, logging, and security.

---

### **Upstream Block**
- Defines the backend servers that Nginx forwards requests to.  

#### **Key Concepts**
1. **Upstream Servers**: Handle traffic from Nginx (e.g., application servers).  
2. **Downstream Servers**: Handle traffic going back to the client.

#### **Example**
```nginx
upstream nodejs_servers {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    location / {
        proxy_pass http://nodejs_servers;
    }
}
```

---

## MIME Types
Nginx uses the MIME type to inform clients about the type of content being sent.  

### **How It Works**
- Nginx includes a predefined `mime.types` file.  
- The `mime.types` file maps file extensions to MIME types.

#### **Example**
```nginx
include mime.types;
```

---