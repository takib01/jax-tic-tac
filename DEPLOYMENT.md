# Deployment Guide for Jax Tic-Tac-Toe

This guide covers various deployment options for the Jax Tic-Tac-Toe project.

## Google Cloud Platform Deployment

### Option 1: Google Cloud Storage (Static Hosting)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create a Google Cloud Storage bucket:**
   ```bash
   gsutil mb gs://your-bucket-name
   ```

3. **Upload the dist folder:**
   ```bash
   gsutil -m cp -r dist/* gs://your-bucket-name
   ```

4. **Configure for web hosting:**
   ```bash
   gsutil web set -m index.html -e index.html gs://your-bucket-name
   ```

5. **Make bucket public:**
   ```bash
   gsutil iam ch allUsers:objectViewer gs://your-bucket-name
   ```

### Option 2: Google App Engine

1. Create an `app.yaml` file in the root directory:
   ```yaml
   runtime: nodejs18
   
   handlers:
   - url: /static
     static_dir: dist
   
   - url: /.*
     static_files: dist/index.html
     upload: dist/index.html
   ```

2. Deploy:
   ```bash
   gcloud app deploy
   ```

### Option 3: Google Cloud Run

1. Create a `Dockerfile`:
   ```dockerfile
   FROM nginx:alpine
   COPY dist /usr/share/nginx/html
   EXPOSE 8080
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Build and deploy:
   ```bash
   docker build -t gcr.io/PROJECT-ID/jax-tic-tac .
   docker push gcr.io/PROJECT-ID/jax-tic-tac
   gcloud run deploy --image gcr.io/PROJECT-ID/jax-tic-tac
   ```

## Other Deployment Options

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Build: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository

### GitHub Pages
```bash
npm run build
# Copy dist contents to gh-pages branch or use GitHub Actions
```

## Pre-deployment Checklist

- [x] Remove all Lovable references
- [x] Update package.json with correct project info
- [x] Add proper LICENSE file
- [x] Update README.md with deployment instructions
- [x] Clean HTML meta tags
- [x] Configure Vite base path for GitHub Pages deployment
- [x] Test build process
- [x] Verify all functionality works
- [x] Setup GitHub Actions workflow
- [x] Fix npm dependency resolution issues

## Performance Optimization

The project is already optimized with:
- Vite for fast building
- React SWC for fast compilation
- Tailwind CSS with purging
- Modern ES modules
- Tree shaking enabled

Build size: ~100KB gzipped