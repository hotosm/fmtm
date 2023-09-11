import React from 'react';
import AssetModules from '../../shared/AssetModules.js';
import { CommonActions } from '../../store/slices/CommonSlice';
import CoreModules from '../../shared/CoreModules.js';

const StepSwitcher = ({ data, flag }) => {
  interface IStep {
    step: number;
    children: IStepChildren[];
  }

  interface IIndividualStep {
    step: number;
    label: string;
    name: string;
    children: IStepChildren[];
  }

  interface IStepChildren {
    page: number;
    name: string;
  }
  const dispatch = CoreModules.useAppDispatch();
  const currentStep = CoreModules.useAppSelector((state) => state.common.currentStepFormStep[flag]);

  const toggleStep = (step: IStep) => {
    dispatch(CommonActions.SetCurrentStepFormStep({ flag: flag, step: step.step, children: step.children }));
  };
  return (
    <div className="fmtm-flex fmtm-w-fit fmtm-mx-auto fmtm-py-5 fmtm-flex-wrap fmtm-gap-3">
      {data?.map((step: IIndividualStep, i = 1) => {
        const index = i + 1;
        return (
          <div key={step.step}>
            <div className="fmtm-flex fmtm-items-center">
              <div className="fmtm-flex fmtm-flex-col">
                <div className="fmtm-flex fmtm-items-end fmtm-gap-3">
                  <p className="fmtm-text-2xl fmtm-font-[600] fmtm-ml-1">{step.label}</p>
                  <p className="fmtm-text-gray-500">{step.name}</p>
                </div>
                <div className="fmtm-flex fmtm-items-center">
                  <div
                    className={`fmtm-w-9 fmtm-h-9 fmtm-rounded-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-border-[0.15rem] fmtm-border-red-600 hover:fmtm-cursor-pointer ${
                      currentStep.step >= index ? 'fmtm-bg-red-600' : 'fmtm-bg-transparent'
                    }`}
                    onClick={() => toggleStep(step)}
                  >
                    <AssetModules.DoneIcon
                      className={`${currentStep.step >= index ? 'fmtm-text-white' : 'fmtm-text-red-600'}`}
                    />
                  </div>
                  {data?.length > index && (
                    <div
                      className={`fmtm-border-t-[3px] fmtm-border-red-600 fmtm-w-[12rem] fmtm-mx-4 ${
                        currentStep.step - 1 >= index ? 'fmtm-border-solid' : 'fmtm-border-dashed'
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepSwitcher;
