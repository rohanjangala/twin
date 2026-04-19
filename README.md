**You can view my personal twin live at: https://dcyjee0zf75ua.cloudfront.net/**

This project has been deployed to AWS at the above link; if you want to set this up for yourself, you'll need some amount of patience. Part of the setup is below. For full setup, I'll recommend you check out: http://github.com/ed-donner/production/blob/main/week2/day2.md

First check `frontend/components/twin.tsx` - find the fetch call and update:

```typescript
// Replace this line:
constresponse = awaitfetch('http://localhost:8000/chat', {

// With your API Gateway URL:
const response = awaitfetch('https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/chat', {
```

### **Run Locally**

```bash
// Switch on backend server:
cd backend
uv run uvicorn server:app --reload

// Switch on frontend:
cd frontend
npm install
npm run dev
```

### **Backend Code**

**Build the Lambda Package**

Make sure Docker Desktop is running, then:

```bash
cd backend
uv run deploy.py
```

This creates `lambda-deployment.zip` containing your Lambda function and all dependencies.

**Direct Upload (for fast connections)**

1. In the Lambda function page, under **Code source**
2. Click **Upload from** → **.zip file**
3. Click **Upload** and select your `backend/lambda-deployment.zip`
4. Click **Save**

### Frontend Code

**Build Static Export**

```bash
cd frontend
npm run build
```

This creates an `out` directory with static files.

 **Note** : With Next.js 15.5 and App Router, you must set `output: 'export'` in the config to generate the `out` directory.

**Upload to S3**

Use the AWS CLI to upload your static files:

```bash
cd frontend
aws s3 sync out/ s3://YOUR-FRONTEND-BUCKET-NAME/ --delete
```

The `--delete` flag ensures that old files are removed from S3 if they're no longer in your build.
