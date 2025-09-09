@echo off
echo Setting up Vercel environment variables...

echo Setting AUTH_URL...
echo https://fuse-react-rev88n26k-itpromohammed-4887-6af55d4d.vercel.app | npx vercel env add AUTH_URL production

echo Setting NEXT_PUBLIC_BASE_URL...
echo https://fuse-react-rev88n26k-itpromohammed-4887-6af55d4d.vercel.app | npx vercel env add NEXT_PUBLIC_BASE_URL production

echo Setting AUTH_SECRET...
echo s55T4WnE0XHfkljb+Hqvib2M4QR4uETFP/R9vv0QwMo | npx vercel env add AUTH_SECRET production

echo Environment variables set successfully!
echo Triggering new deployment...
npx vercel --prod

echo Done!