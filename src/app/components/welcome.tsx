import React, { useState } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Image from "next/image";
import welcomeLogo from "../../../public/assets/login/welcome.png";
import step1Img from "../../../public/assets/login/step1.png";
import step2Img from "../../../public/assets/login/step2.png";
import step3Img from "../../../public/assets/login/step3.png";

interface MultiStepModalProps {
  showWelcomeModal: boolean;
  handleCloseWelcomeModal: () => void;
  handleCloseWelcomeModalWithoutCookie: () => void;
}

const MultiStepModal: React.FC<MultiStepModalProps> = ({ showWelcomeModal, handleCloseWelcomeModal, handleCloseWelcomeModalWithoutCookie }) => {
  const [step, setStep] = useState(1);

  if (!showWelcomeModal) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepData = [
    { 
      title: "Vous êtes nouveau ?", 
      text: <>Commencez par <span className="text-[#FF4F81]">Ajouter un crush</span> en cliquant sur le bouton.</>, 
      image: step1Img 
    },
    { 
      title: "Ensuite ?", 
      text: (
        <>
          Vous verrez ensuite la liste de vos crushs avec un status :<br/><br/>
          <span className="text-[#FFC75F]">En attente</span> : si votre crush n’a pas encore répondu.<br/><br/>
          <span className="text-[#00C897]">Accepter</span> : si votre crush accepte.
        </>
      ), 
      image: step2Img 
    },
    { 
      title: "Enfin ?", 
      text: (
        <>
          Sur la page <span className="text-[#FF4F81]">Qui ma crush</span>, vous verrez la liste de ceux/celles qui crushs sur vous.<br/><br/>
          Vous pouvez répondre avec : <FaHeart className="inline text-[#00C897]" /> pour oui (matcher), et : <FaHeartBroken className="inline text-[#FF4F52]" /> pour non.
        </>
      ), 
      image: step3Img 
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
          <Image src={welcomeLogo} alt="Welcome Logo" width={211} height={80} />
        </div>

        <div className="text-left">
          <h2 className="text-white font-bold text-2xl md:text-[40px] leading-[100%] tracking-[1%] font-poppins">{stepData[step - 1].title}</h2>
          <p className="text-white font-medium text-lg md:text-[24px] leading-[150%] tracking-[1%] font-poppins mt-2">{stepData[step - 1].text}</p>
          <div className="flex justify-center mt-4">
            <Image src={stepData[step - 1].image} alt={`Step ${step}`} className="w-full max-w-[820px] h-auto" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="bg-white text-black py-2 px-4 rounded-lg cursor-pointer"
            >
              Précédent
            </button>
          )}
          <span className="text-white font-bold text-lg">{step}/3</span>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="bg-[#FF4F81] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e04370]"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleCloseWelcomeModal}
              className="bg-[#FF4F81] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e04370]"
            >
              Commencer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepModal;