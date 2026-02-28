# 🔒 Security & Credential Management Guide

## 🚨 EMERGENCY: AWS Credential Compromise Response

**IMMEDIATE ACTION REQUIRED** - Your AWS credentials were exposed:
- **Access Key**: `AKIAXZEFHTMDFLPI2RED`
- **Secret Key**: `84UrEsoeSwtSNBD4q4NZsvYZQaL0M3Bn6jjZFwm`

### Step 1: Rotate Compromised AWS Credentials

#### Through AWS Console:
1. **Login to AWS Management Console**
2. **Navigate to IAM → Users**
3. **Find your user account**
4. **Go to "Security credentials" tab**
5. **Click "Delete" next to the compromised access key**
6. **Click "Create access key"**
7. **Download the new credentials immediately**

#### Using AWS CLI (if installed):
```bash
# List current access keys
aws iam list-access-keys --user-name YOUR_USERNAME

# Delete compromised key
aws iam delete-access-key --user-name YOUR_USERNAME --access-key-id AKIAXZEFHTMDFLPI2RED

# Create new access key
aws iam create-access-key --user-name YOUR_USERNAME
```

### Step 2: Update Deployment Environments

**Render Dashboard (Backend):**
1. Go to your Render service dashboard
2. Navigate to "Environment" section
3. Update these variables:
   - `AWS_ACCESS_KEY_ID` = [new access key]
   - `AWS_SECRET_ACCESS_KEY` = [new secret key]

**Local Development:**
1. Create `backend/.env` (already gitignored)
2. Use new credentials:
```bash
AWS_ACCESS_KEY_ID=your_new_access_key
AWS_SECRET_ACCESS_KEY=your_new_secret_key
```

## 🛡️ Secure Credential Management Process

### 1. Environment Variable Strategy

**Never commit credentials** - Use environment variables:
- Local: `backend/.env` (gitignored)
- Production: Render dashboard environment variables
- Development: `.env.example` with placeholder values

### 2. AWS IAM Best Practices

**Create dedicated IAM user with minimal permissions:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

### 3. Regular Credential Rotation Schedule

- **Access Keys**: Rotate every 90 days
- **Review IAM policies** quarterly
- **Monitor AWS CloudTrail** for suspicious activity

### 4. Emergency Response Procedure

**If credentials are exposed:**
1. **IMMEDIATELY** rotate compromised credentials
2. **Check AWS CloudTrail** for unauthorized access
3. **Review S3 bucket policies** and access logs
4. **Notify team** and update all environments
5. **Document the incident** and lessons learned

## 🔍 Monitoring & Alerting

### AWS CloudWatch Alarms
Set up alerts for:
- Unusual API call patterns
- Unexpected S3 bucket access
- IAM policy changes

### Regular Security Checks
```bash
# Check for exposed credentials in git history
git log --grep="AKIA"
git log --grep="secret"

# Scan for accidental commits
git grep "AWS_ACCESS_KEY_ID"
git grep "AWS_SECRET_ACCESS_KEY"
```

## 🛠️ Development Security

### Pre-commit Hook (Recommended)
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Prevent accidental credential commits
if git diff --cached --name-only | xargs grep -E "(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AKIA)"; then
    echo "ERROR: Potential AWS credentials detected in commit!"
    exit 1
fi
```

### Code Scanning
Use tools like:
- **git-secrets** (AWS official tool)
- **truffleHog** (secrets scanning)
- **ggshield** (GitGuardian)

## 📋 Checklist: Post-Compromise Recovery

- [ ] Rotate ALL exposed AWS credentials
- [ ] Review AWS CloudTrail logs for past 30 days
- [ ] Check S3 bucket access logs
- [ ] Update all environment variables (Render, local)
- [ ] Verify application functionality with new credentials
- [ ] Set up CloudWatch alerts for future detection
- [ ] Educate team on secure credential handling

## 📞 Emergency Contacts

- **AWS Support**: https://aws.amazon.com/contact-us/
- **AWS Security Hub**: For ongoing monitoring
- **Render Support**: https://render.com/contact

## 🔗 Useful Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/security-best-practices/)
- [IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Remember**: Security is an ongoing process. Regular audits, monitoring, and education are essential to prevent future incidents.