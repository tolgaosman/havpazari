import type { Transition, Variants } from "motion/react";

/**
 * Paylaşılan hareket dili.
 *
 * İlke: yay fiziği > bezier eğrisi. Yaylar kesildiğinde mevcut hızını
 * koruyarak yeni hedefe gider — kullanıcı hızlı tıkladığında animasyon
 * kırılmaz. Süre tabanlı geçişler yalnızca sıra (stagger) için kullanılıyor.
 *
 * Yalnızca `transform` ve `opacity` animasyonu yapılıyor; ikisi de
 * compositor thread'inde çalışır, layout tetiklemez.
 */

/** Buton, kart, hover — anında tepki veren ama zıplamayan yay. */
export const snappy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.6,
};

/** Panel, menü, büyük yüzeyler — daha ağır, daha sakin. */
export const soft: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 26,
  mass: 0.9,
};

/** Görünüme giriş için: mesafe kat eden, hafifçe yavaşlayan hareket. */
export const glide: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.8,
};

/**
 * Tek bir öğenin aşağıdan belirmesi.
 * `y` değeri kasıtlı olarak küçük — büyük sıçramalar ucuz görünür.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: glide },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

/** Perde arkasından yukarı kayan başlık satırı (hero'da kullanılıyor). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: 0, transition: glide },
};

/**
 * Çocuklarını sırayla açan kap.
 * `staggerChildren` kısa tutuldu: 6 kartlık bir ızgara 0.3sn'de tamamlanır,
 * kullanıcı beklemiş hissetmez.
 */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Görünüm alanı tetikleyicisi için ortak ayar — bir kez oynar, tekrar etmez. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
