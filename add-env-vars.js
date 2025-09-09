import { execSync } from 'child_process';

const envVars = [
  {
    name: 'AUTH_URL',
    value: 'https://fuse-react-rev88n26k-itpromohammed-4887-6af55d4d.vercel.app',
    target: 'production'
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL', 
    value: 'https://fuse-react-rev88n26k-itpromohammed-4887-6af55d4d.vercel.app',
    target: 'production'
  },
  {
    name: 'AUTH_SECRET',
    value: 's55T4WnE0XHfkljb+Hqvib2M4QR4uETFP/R9vv0QwMo',
    target: 'production'
  },
  {
    name: 'NEXT_PUBLIC_DATA_PROVIDER',
    value: 'mock',
    target: 'production'
  }
];

console.log('🚀 Setting up Vercel environment variables...\n');

envVars.forEach((envVar, index) => {
  console.log(`${index + 1}. Adding ${envVar.name}...`);
  try {
    // Use echo to pipe the value to vercel env add
    const command = `echo "${envVar.value}" | npx vercel env add ${envVar.name} ${envVar.target}`;
    console.log(`   Command: ${command}`);
    console.log(`   Value: ${envVar.value}`);
    
    // For now, just show what would be executed
    console.log(`   ✓ Environment variable ${envVar.name} ready to be set`);
  } catch (error) {
    console.log(`   ❌ Error setting ${envVar.name}:`, error.message);
  }
  console.log('');
});

console.log('📋 MANUAL STEPS REQUIRED:');
console.log('');
console.log('Go to your Vercel Dashboard:');
console.log('1. Visit: https://vercel.com/dashboard');
console.log('2. Select your project: fuse-react-js');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add these variables:');
console.log('');

envVars.forEach((envVar, index) => {
  console.log(`${index + 1}. Name: ${envVar.name}`);
  console.log(`   Value: ${envVar.value}`);
  console.log(`   Environment: Production`);
  console.log('');
});

console.log('5. After adding all variables, redeploy your project');
console.log('6. Run: npx vercel --prod');