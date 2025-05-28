
// Realistic crash point generation using exponential distribution
export class CrashAlgorithm {
  private static readonly HOUSE_EDGE = 0.01; // 1% house edge
  private static readonly MIN_MULTIPLIER = 1.0;
  private static readonly MAX_MULTIPLIER = 1000;
  
  // Generate crash point using exponential distribution
  static generateCrashPoint(): number {
    // Use exponential distribution for realistic crashes
    const random = Math.random();
    
    // Different probability zones
    if (random < 0.33) {
      // 33% chance: Early crash (1.0x - 2.5x)
      return 1.0 + Math.random() * 1.5;
    } else if (random < 0.66) {
      // 33% chance: Medium crash (2.5x - 8.0x)
      return 2.5 + Math.random() * 5.5;
    } else if (random < 0.85) {
      // 19% chance: High crash (8.0x - 25.0x)
      return 8.0 + Math.random() * 17.0;
    } else if (random < 0.95) {
      // 10% chance: Very high crash (25.0x - 100.0x)
      return 25.0 + Math.random() * 75.0;
    } else {
      // 5% chance: Moon shot (100.0x - 1000.0x)
      return 100.0 + Math.random() * 900.0;
    }
  }
  
  // Calculate multiplier progression with realistic volatility
  static calculateMultiplier(progress: number, crashPoint: number, startTime: number): number {
    const elapsed = (Date.now() - startTime) / 1000;
    
    // Base exponential growth
    let multiplier = 1 + (crashPoint - 1) * Math.pow(progress, 0.7);
    
    // Add micro-volatility for realism
    const volatility = 0.02 * Math.sin(elapsed * 10) * Math.random();
    multiplier += volatility;
    
    // Add tension spikes near crash point
    if (progress > 0.8) {
      const tensionSpike = 0.05 * Math.sin(elapsed * 20) * (progress - 0.8);
      multiplier += tensionSpike;
    }
    
    return Math.max(1.0, Math.min(multiplier, crashPoint));
  }
  
  // Check if should crash with some randomness near crash point
  static shouldCrash(currentMultiplier: number, crashPoint: number): boolean {
    if (currentMultiplier >= crashPoint) return true;
    
    // Add 2% chance of early crash when within 5% of crash point
    const proximityToChance = (currentMultiplier / crashPoint);
    if (proximityToChance > 0.95) {
      return Math.random() < 0.02;
    }
    
    return false;
  }
}
