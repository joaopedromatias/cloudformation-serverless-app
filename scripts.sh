#!/bin/bash

WEBSITE_HOST_BUCKET_NAME=image-uploader-app-website
CF_PACKAGE_BUCKET_NAME=cf-package-image-uploader-app
IMAGES_BUCKET_NAME=images-from-image-uploader-app

case "$1" in
    create-infra)
        cd backend && 
        npm run build && 
        cd .. &&

        aws s3api create-bucket \
            --bucket "$CF_PACKAGE_BUCKET_NAME"

        aws cloudformation package \
            --template-file ./infra.yml \
            --s3-bucket "$CF_PACKAGE_BUCKET_NAME" \
            --output-template-file infra.packaged.yml

        aws cloudformation deploy \
            --stack-name app-stack \
            --template-file ./infra.packaged.yml \
            --capabilities CAPABILITY_IAM \
            --parameter-overrides S3BucketWebsiteHostingName="$WEBSITE_HOST_BUCKET_NAME" S3BucketImagesName="$IMAGES_BUCKET_NAME"

        API_ENDPOINT=$(aws cloudformation describe-stacks \
            --stack-name app-stack \
            --query 'Stacks[0].Outputs[?OutputKey==`RestApiEndpoint`].OutputValue' --output text)

        echo api endpoint ready: $API_ENDPOINT

        echo "NEXT_PUBLIC_API_ENDPOINT=$API_ENDPOINT" > .env.local
        ;;
    delete-infra)
        aws s3api delete-objects \
            --bucket "$CF_PACKAGE_BUCKET_NAME" \
            --delete "$(aws s3api list-object-versions \
                --bucket "$CF_PACKAGE_BUCKET_NAME" \
                --output=json \
                --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}'
            )"

        aws s3api delete-bucket \
            --bucket "$CF_PACKAGE_BUCKET_NAME"

        aws s3api delete-objects \
            --bucket "$WEBSITE_HOST_BUCKET_NAME" \
            --delete "$(aws s3api list-object-versions \
                --bucket "$WEBSITE_HOST_BUCKET_NAME" \
                --output=json \
                --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}'
            )"

        aws s3api delete-objects \
            --bucket "$IMAGES_BUCKET_NAME" \
            --delete "$(aws s3api list-object-versions \
                --bucket "$IMAGES_BUCKET_NAME" \
                --output=json \
                --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}'
            )"
        
        aws cloudformation delete-stack \
            --stack-name app-stack
        ;;
    deploy-next-app)
        npm run build

        aws s3 sync ./build s3://$WEBSITE_HOST_BUCKET_NAME
        ;;
esac