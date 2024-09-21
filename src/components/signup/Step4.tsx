import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkNicknameAvailability } from '@/service/auth';
import { formatBirthDate } from '@/utils/dateUtils';
import Image from 'next/image';

interface StepProps {
  onNext: () => void;
  onUpdate: (data: { name?: string; nickname?: string; birthDate?: string; investmentExperience?: string }) => void;
}

const Step4: React.FC<StepProps> = ({ onNext, onUpdate }) => {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [birthdate, setBirthdate] = useState('');
  const [isBirthdateValid, setIsBirthdateValid] = useState(false);
  const [investmentExperience, setInvestmentExperience] = useState<string | null>(null);
  const [investmentYears, setInvestmentYears] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter(); 

  const validateForm = useCallback(() => {
    if (!name || !nickname || !isNicknameValid || !isBirthdateValid || !investmentExperience) {
      return false; // 필수 필드가 모두 입력되지 않으면 false
    }
    
    if (investmentExperience === 'yes' && !investmentYears) {
      return false; // 투자 경험 있음인데 투자 경력이 없으면 false
    }

    return true; // 모든 조건이 충족되면 true
  }, [name, nickname, isNicknameValid, isBirthdateValid, investmentExperience, investmentYears]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  useEffect(() => {
    const formattedBirthDate = formatBirthDate(birthdate);
    onUpdate({
      name,
      nickname,
      birthDate: formattedBirthDate,
      investmentExperience: investmentExperience === 'yes' ? `${investmentYears}년` : '없음',
    });
  }, [name, nickname, birthdate, investmentExperience, investmentYears, onUpdate]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameValid(null);
  };

  const checkNickname = async () => {
    try {
      const response = await checkNicknameAvailability(nickname);
      if (response) {
        setIsNicknameValid(true);
      } else {
        setIsNicknameValid(false);
      }
    } catch (error) {
      setIsNicknameValid(false);
    }
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
    const formattedDate = formatBirthDateInput(value);
    setBirthdate(formattedDate);
    setIsBirthdateValid(value.length === 8);
  };

  const formatBirthDateInput = (value: string): string => {
    // 생년월일 포맷팅
    if (value.length <= 4) return value;
    if (value.length <= 6) return `${value.slice(0, 4)}.${value.slice(4)}`;
    return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
  };

  const handleInvestmentExperienceChange = (experience: string) => {
    setInvestmentExperience(experience);
    if (experience === 'no') {
      setInvestmentYears('');
    }
  };

  const handleInvestmentYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentYears(e.target.value.replace(/\D/g, ''));
  };

  const handleComplete = async () => {
    if (isFormValid) {
      try {
        await onNext();
        console.log('가입성공');
        router.push('/sign');
      } catch (error) {
        console.error('가입 처리 중 오류 발생:', error);
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-100px)] flex flex-col items-center justify-between mb-[100px] sm:min-h-[100vh] sm:justify-center sm:mb-0">
      <div className="max-w-[340px] w-full mx-auto mt-[30px] sm:mt-0">
        <Image
          src={'/sign/LeftArrowIcon.svg'}
          alt='뒤로가기'
          width={24}
          height={24}
          className='cursor-pointer'
          onClick={() => router.back()} 
        />
        <Image
          className="mt-6 mb-6"
          src={'/sign/ProgressBar4.svg'}
          alt="ProgressBar"
          width={360}
          height={100}
        />
        <h2 className="text-xl font-bold mb-6 leading-tight">
          모아가이드에서 사용할<br /><span className="text-purple-600">상세정보</span>를 입력해주세요
        </h2>
        <div className="">
          <div className="text-body3">닉네임</div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임 입력"
              className={`flex-1 min-w-0 px-4 py-[14px] bg-bg rounded-[12px] text-body2 focus:outline-normal
              ${nickname ? (isNicknameValid === true ? 'outline-success' : 'outline-error') : 'outline-none'}`}
            />
            <div
              onClick={checkNickname}
              className={`ml-[6px] flex-shrink-0 px-4 py-[14px] bg-black rounded-[12px] text-white text-title2 cursor-pointer`}
            >
              중복확인
            </div>
          </div>
          <div className="min-h-8 flex items-center">
            {isNicknameValid === true && (
              <p className="text-blue-500 text-xs">사용 가능한 닉네임입니다.</p>
            )}
            {isNicknameValid === false && (
              <p className="text-red-500 text-xs">이미 사용중인 닉네임입니다.</p>
            )}
            </div>
          </div>
        <div className="mb-8">
          <div className="text-body3">이름</div>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 px-4 py-[14px] bg-bg rounded-[12px] outline-none text-body2 focus:outline-normal"
          />
        </div>

        <div className='mb-8'>
          <div className="text-body3">생년월일</div>
          <input
            type="text"
            placeholder="생년월일 8자리 입력"
            value={birthdate}
            onChange={handleBirthdateChange}
            className="w-full px-4 py-[14px] bg-bg rounded-[12px] outline-none text-body2 mt-2 focus:outline-normal"
          />
        </div>

        <div className="mb-8">
          <div className="text-body3">투자 경험</div>
          <div className='flex w-full mt-2'>
            <button
              onClick={() => handleInvestmentExperienceChange('no')}
              className={`flex-1 py-3 px-4 rounded-lg border mr-1 ${investmentExperience === 'no' ? 'border-purple-600 text-purple-600' : 'border-gray-100 text-gray-600'}`}
            >
              투자 경험 없음
            </button>
            <button
              onClick={() => handleInvestmentExperienceChange('yes')}
              className={`flex-1 py-3 px-4 rounded-lg border ml-1 ${investmentExperience === 'yes' ? 'border-purple-600 text-purple-600' : 'border-gray-100 text-gray-600'}`}
            >
              투자 경험 있음
            </button>
          </div>
        </div>

        {investmentExperience === 'yes' && (
          <div className="mb-8">
            <div className="text-body3">투자 경력 (N년)</div>
            <div className='flex justify-end items-center mt-2'>
              <input
                type="text"
                value={investmentYears}
                onChange={handleInvestmentYearsChange}
                className="w-full py-3 px-4 rounded-[12px] border border-gray-100 focus:outline-normal text-right"
              />
              <div className="text-body3 my-auto ml-2">년</div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleComplete}
        disabled={!isFormValid}
        className={`w-full max-w-[340px] py-3 rounded-[12px] text-lg font-bold text-white  mt-0 sm:mt-[40px] ${isFormValid ? 'bg-gradient2 text-heading4 text-white' : 'bg-gray100 text-heading4 text-gray400 cursor-not-allowed'}`}
      >
        완료
      </button>
    </div>
  );
};

export default Step4;
