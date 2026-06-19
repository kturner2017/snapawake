import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../theme';

export function CameraScreen({ alarm, onPhotoTaken, onCancel }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);

  // Web fallback: use file input to pick a photo
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webWrapper}>
          <Text style={styles.webIcon}>📷</Text>
          <Text style={styles.webTitle}>Show your {alarm.targetObject}</Text>
          <Text style={styles.webHint}>Upload a photo of your {alarm.targetObject} to dismiss the alarm.</Text>

          <label style={webInputLabelStyle}>
            Choose Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setCapturing(true);
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result.split(',')[1];
                  onPhotoTaken(base64);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>

          <TouchableOpacity onPress={onCancel} style={styles.cancelLink}>
            <Text style={styles.cancelLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permText}>Camera access needed to verify your photo.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  async function takePhoto() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      onPhotoTaken(photo.base64);
    } catch (e) {
      console.error('Camera error', e);
      setCapturing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.targetBubble}>
              <Text style={styles.targetText}>Show your {alarm.targetObject}</Text>
            </View>
          </View>

          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.shutterOuter, capturing && styles.shutterDisabled]}
              onPress={takePhoto}
              disabled={capturing}
              activeOpacity={0.8}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

// Inline style for web file input label (can't use StyleSheet for HTML elements)
const webInputLabelStyle = {
  display: 'inline-block',
  backgroundColor: '#4ade80',
  color: '#0d1510',
  fontWeight: '700',
  fontSize: 16,
  padding: '14px 32px',
  borderRadius: 20,
  cursor: 'pointer',
  marginTop: 24,
  textAlign: 'center',
};

const C_SIZE = 24;
const cornerStyle = {
  position: 'absolute',
  width: C_SIZE,
  height: C_SIZE,
  borderColor: theme.colors.primary,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg, gap: theme.spacing.md },
  cancelBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#fff', fontSize: 18 },
  targetBubble: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: theme.radius.full, paddingHorizontal: 16, paddingVertical: 8 },
  targetText: { color: theme.colors.primary, fontWeight: '700', fontSize: theme.font.sm, textAlign: 'center' },
  frame: { width: 220, height: 220, alignSelf: 'center', position: 'relative' },
  corner: cornerStyle,
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  bottomBar: { alignItems: 'center', paddingBottom: 40 },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: { opacity: 0.4 },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  permText: { color: theme.colors.text, fontSize: theme.font.md, textAlign: 'center', padding: theme.spacing.xl },
  permBtn: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.md, marginHorizontal: theme.spacing.xl },
  permBtnText: { color: theme.colors.bg, textAlign: 'center', fontWeight: '700' },
  // Web styles
  webWrapper: { flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.md },
  webIcon: { fontSize: 72 },
  webTitle: { color: theme.colors.primary, fontSize: theme.font.xl, fontWeight: '700', textAlign: 'center' },
  webHint: { color: theme.colors.textMuted, fontSize: theme.font.sm, textAlign: 'center', lineHeight: 22 },
  cancelLink: { marginTop: theme.spacing.lg },
  cancelLinkText: { color: theme.colors.textMuted, fontSize: theme.font.sm },
});
