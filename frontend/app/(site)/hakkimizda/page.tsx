import type { Metadata } from "next";
import Image from "next/image";
import { Award, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ContactCta } from "@/components/product/ContactCta";
import { editorialImages } from "@/lib/mockData";
import { getSiteSettings } from "@/lib/api";
import { defaultSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${defaultSiteConfig.name} — Düzova'da yılların verdiği tecrübeyle av ve outdoor ekipmanı.`,
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  {
    icon: MapPin,
    title: "Yerel ve Ulaşılabilir",
    description:
      "Düzova'nın tam ortasında, arabanızı park edip beş dakikada içeri girebileceğiniz bir mağaza.",
  },
  {
    icon: ShieldCheck,
    title: "Ruhsatlı ve Güvenilir",
    description:
      "Silah ve mühimmat satışında mevzuata tam uyum; belgeniz olmadan hiçbir ürün elinize geçmez.",
  },
  {
    icon: Wrench,
    title: "Satış Sonrası Destek",
    description:
      "Bıçak bileme, tüfek bakımı ve küçük tamiratlar için satın aldığınız yer değil, güvendiğiniz yer oluyoruz.",
  },
  {
    icon: Award,
    title: "Denenmiş Ürün",
    description:
      "Rafa koyduğumuz her ürünü kendimiz kullanıyoruz. Tavsiye ettiğimiz şey, arazide bize de yetiyor.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-24 pt-32 sm:pt-36">
      <div className="container-page">
        <Reveal immediate className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
            Hakkımızda
          </span>
          <h1 className="mt-2 text-display-lg font-bold uppercase text-optic">
            Bu İşi Severek Yapıyoruz
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ash">
            Hasan Av Dünyası, Düzova&apos;da avcılığa ve doğa sporlarına
            gönül vermiş bir ailenin işletmesidir. Amacımız yalnızca ürün
            satmak değil; doğru ekipmanı, doğru kişiye, doğru bilgiyle
            ulaştırmak.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-14 h-[50vh] w-full overflow-hidden sm:h-[60vh]">
        <Image
          src={editorialImages.storyPrimary.url}
          alt={editorialImages.storyPrimary.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />
      </Reveal>

      <div className="container-page mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-4 text-ash">
          <h2 className="text-display-sm font-bold uppercase text-optic">Hikayemiz</h2>
          <p>
            Yıllar önce küçük bir tezgahla başlayan bu iş, bugün KKTC&apos;nin
            dört bir yanından avcının ve doğa sporcusunun uğradığı bir
            mağazaya dönüştü. Değişmeyen tek şey, her müşteriyle bir avcı
            gibi konuşmamız oldu — satıcı gibi değil.
          </p>
          <p>
            Kıbrıs&apos;ın kendine has arazisini, makisini ve iklimini
            tanıyoruz. Sattığımız her ceket, her bot, her optik bu koşullar
            düşünülerek seçiliyor; kataloğa bakıp seçmiyoruz, kendimiz
            kullanıp öyle karar veriyoruz.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-steel">
          <Image
            src={editorialImages.storySecondary.url}
            alt={editorialImages.storySecondary.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>

      <div className="container-page mt-20 sm:mt-28">
        <Reveal className="mb-10 flex flex-col gap-3">
          <span className="rule-brass w-16" aria-hidden="true" />
          <h2 className="text-display-md font-bold uppercase text-optic">Neden Biz</h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <StaggerItem
              key={value.title}
              className="flex flex-col gap-3 rounded-lg border border-steel bg-charcoal p-6"
            >
              <value.icon className="size-6 text-brass" aria-hidden="true" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-optic">
                {value.title}
              </h3>
              <p className="text-sm text-ash">{value.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="container-page mt-20 sm:mt-28">
        <Reveal className="flex flex-col items-center gap-6 rounded-lg border border-steel bg-charcoal px-6 py-12 text-center sm:px-12">
          <h2 className="text-display-sm font-bold uppercase text-optic sm:text-display-md">
            Sorunuz mu Var?
          </h2>
          <p className="max-w-md text-ash">
            Hangi ürünün size uygun olduğundan emin değilseniz, bizi arayın —
            zevkle yardımcı oluruz.
          </p>
          <div className="w-full max-w-xl">
            <ContactCta productName="Mağaza" sku="Genel" settings={settings} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
