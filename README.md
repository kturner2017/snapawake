# SnapAwake 📷⏰

A wake-up alarm app that forces you to photograph a pre-set object to dismiss the alarm. AI verifies the photo so you can't cheat.

---

## Running on your phone in 10 minutes

### 1. Install prerequisites (one-time)

- **Node.js**: Download from https://nodejs.org (LTS version)
- **Expo Go app**: Install from the App Store (iOS) or Google Play (Android)

### 2. Set up the project

Open Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```bash
# Navigate to this folder
cd path/to/SnapAwake

# Install dependencies
npm install
```

### 3. Add your Anthropic API key

Open `src/utils/verify.js` and replace `YOUR_API_KEY_HERE` with your real API key:

```js
const ANTHROPIC_API_KEY = 'sk-ant-...your key here...';
```

Get a key at: https://console.anthropic.com

> ⚠️ For a real production app, move this key to a backend server so it isn't exposed in the app bundle.

### 4. Start the app

```bash
npx expo start
```

This opens a QR code in your terminal. Scan it with:
- **iPhone**: The Camera app (iOS 16+) or Expo Go
- **Android**: The Expo Go app

The app will load on your phone instantly. Any code changes you save will reload automatically.

---

## Publishing to the App Store / Google Play

When you're ready to share with others:

### iOS (App Store)
1. Create an Apple Developer account at https://developer.apple.com ($99/year)
2. Run `npx expo build:ios` or use EAS Build: `npx eas build --platform ios`
3. Submit via App Store Connect

### Android (Google Play)
1. Create a Google Play Developer account ($25 one-time)
2. Run `npx eas build --platform android`
3. Upload the .aab file to Google Play Console

### EAS Build (recommended for both)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all
```

---

## Project structure

```
SnapAwake/
├── App.js                  # Root — screen router + state
├── app.json                # Expo config (name, permissions, bundle ID)
├── src/
│   ├── theme.js            # Colors, fonts, spacing
│   ├── components/
│   │   ├── UI.js           # Reusable buttons, cards, toggles
│   │   └── TabBar.js       # Bottom nav bar
│   ├── screens/
│   │   ├── HomeScreen.js   # Alarm list
│   │   ├── SetupScreen.js  # Create/edit alarm
│   │   ├── RingingScreen.js  # Alarm firing
│   │   ├── CameraScreen.js   # Take snap photo
│   │   ├── VerifyingScreen.js # AI check
│   │   ├── DismissedScreen.js # Success
│   │   └── StreaksScreen.js   # History & stats
│   └── utils/
│       ├── storage.js      # AsyncStorage helpers
│       └── verify.js       # Anthropic API call
```

---

## Next steps / ideas

- [ ] Push notifications to fire alarms at the right time (needs `expo-notifications`)
- [ ] Sound/vibration on the ringing screen (needs `expo-av`)
- [ ] Weekly email summary
- [ ] Share your streak as an image
- [ ] Challenge a friend to a streak competition
