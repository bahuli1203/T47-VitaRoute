/**
 * Audio Synthesizer for Emergency Medical Coordination
 * Uses standard Web Audio API - hermetic, zero external asset dependencies
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private urgentInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopUrgentAlert();
    }
  }

  /**
   * Quick tactile click / haptic feedback sound
   */
  public playTap() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // safe fallback
    }
  }

  /**
   * Positive Bed Held / Accepted Chime
   */
  public playAcceptChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // safe fallback
    }
  }

  /**
   * Hold Expired or Rejection alert sound
   */
  public playRejectTone() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [440, 311.13]; // A4 to D#4 (diminished 5th tension)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
      });
    } catch {
      // safe fallback
    }
  }

  /**
   * Tick sound for countdown urgency
   */
  public playCountdownTick(isFinalTen: boolean = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isFinalTen ? 'square' : 'sine';
      osc.frequency.setValueAtTime(isFinalTen ? 1200 : 880, ctx.currentTime);

      gain.gain.setValueAtTime(isFinalTen ? 0.18 : 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // safe fallback
    }
  }

  /**
   * Start recurring medical incoming patient telemetry alert
   */
  public startUrgentAlert() {
    if (this.urgentInterval) return;
    const playBeep = () => {
      if (this.isMuted) return;
      try {
        const ctx = this.getContext();
        if (!ctx) return;

        // Double pulse beep (hospital telemetry style)
        [0, 0.15].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(950, ctx.currentTime + offset);
          osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + offset + 0.09);

          gain.gain.setValueAtTime(0.2, ctx.currentTime + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + offset);
          osc.stop(ctx.currentTime + offset + 0.09);
        });
      } catch {
        // safe fallback
      }
    };

    playBeep();
    this.urgentInterval = window.setInterval(playBeep, 2400);
  }

  public stopUrgentAlert() {
    if (this.urgentInterval !== null) {
      clearInterval(this.urgentInterval);
      this.urgentInterval = null;
    }
  }

  /**
   * Haptic vibration trigger with fallback
   */
  public triggerVibration(pattern: number | number[] = [40, 60, 40]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore if blocked by browser policy
      }
    }
  }
}

export const soundManager = new SoundEffectsManager();
