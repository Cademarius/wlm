import React, { useState } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Image from "next/image";
import welcomeLogo from "../../../../public/images/ui/welcome.png";
import step1Img from "../../../../public/images/ui/step1.png";
import step2Img from "../../../../public/images/ui/step2.png";
import step3Img from "../../../../public/images/ui/step3.png";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

interface MultiStepModalProps {
  showWelcomeModal: boolean;
  handleCloseWelcomeModal: () => void;
  handleCloseWelcomeModalWithoutCookie: () => void;
  params: { lang: Language };
}

const MultiStepModal: React.FC<MultiStepModalProps> = ({ 
  showWelcomeModal, 
  handleCloseWelcomeModal, 
  handleCloseWelcomeModalWithoutCookie,
  params 
}) => {
  const t = getTranslation(params.lang);
  const [step, setStep] = useState(1);

  if (!showWelcomeModal) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepData = [
    { 
      title: t.welcomeModal.step1.title, 
      text: (
        <>
          {t.welcomeModal.step1.textBefore}{" "}
          <span className="text-[#FF4F81]">{t.welcomeModal.step1.addCrushText}</span>{" "}
          {t.welcomeModal.step1.textAfter}
        </>
      ), 
      image: step1Img,
      alt: t.welcomeModal.step1.imageAlt
    },
    { 
      title: t.welcomeModal.step2.title, 
      text: (
        <>
          {t.welcomeModal.step2.textIntro}<br/><br/>
          <span className="text-[#FFC75F]">{t.welcomeModal.step2.pendingStatus}</span>{t.welcomeModal.step2.pendingText}<br/><br/>
          <span className="text-[#00C897]">{t.welcomeModal.step2.acceptedStatus}</span>{t.welcomeModal.step2.acceptedText}
        </>
      ), 
      image: step2Img,
      alt: t.welcomeModal.step2.imageAlt
    },
    { 
      title: t.welcomeModal.step3.title, 
      text: (
        <>
          {t.welcomeModal.step3.textBefore}{" "}
          <span className="text-[#FF4F81]">{t.welcomeModal.step3.crushPageText}</span>
          {t.welcomeModal.step3.textMiddle}<br/><br/>
          {t.welcomeModal.step3.responseText}{" "}
          <FaHeart className="inline text-[#00C897]" />{" "}
          {t.welcomeModal.step3.yesText}{" "}
          <FaHeartBroken className="inline text-[#FF4F52]" />{" "}
          {t.welcomeModal.step3.noText}
        </>
      ), 
      image: step3Img,
      alt: t.welcomeModal.step3.imageAlt
    }
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black z-40 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleCloseWelcomeModalWithoutCookie}
    >
      <div
        className="bg-[#1C1F3F] p-6 md:p-10 rounded-[12px] w-full max-w-[820px] flex flex-col gap-6 md:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 border-b-2 border-white pb-2 flex items-center justify-center">
          <Image 
            src={welcomeLogo} 
            alt={t.welcomeModal.welcomeLogoAlt} 
            width={211} 
            height={80} 
          />
        </div>

        <div className="text-left">
          <h2 className="text-white font-bold text-2xl md:text-[40px] leading-[100%] tracking-[1%] font-poppins">
            {stepData[step - 1].title}
          </h2>
          <p className="text-white font-medium text-lg md:text-[24px] leading-[150%] tracking-[1%] font-poppins mt-2">
            {stepData[step - 1].text}
          </p>
          <div className="flex justify-center mt-4">
            <Image 
              src={stepData[step - 1].image} 
              alt={stepData[step - 1].alt} 
              className="w-full max-w-[820px] h-auto" 
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="bg-white text-black py-2 px-4 rounded-lg cursor-pointer"
            >
              {t.welcomeModal.navigation.previous}
            </button>
          )}
          <span className="text-white font-bold text-lg">
            {step}/{t.welcomeModal.navigation.totalSteps}
          </span>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="bg-[#FF4F81] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e04370]"
            >
              {t.welcomeModal.navigation.next}
            </button>
          ) : (
            <button
              onClick={handleCloseWelcomeModal}
              className="bg-[#FF4F81] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e04370]"
            >
              {t.welcomeModal.navigation.start}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepModal;