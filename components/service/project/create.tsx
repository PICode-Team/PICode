import React, { useState } from "react";
import { createProjectStyle } from "../../../styles/service/project/create";

interface TStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setCreateInfo: React.Dispatch<React.SetStateAction<TCreate>>;
}

interface TCreate {
  repositoryName: string;
  projectName: string;
  newRepository: boolean;
}

function Step1({ setStep, setCreateInfo }: TStepProps) {
  const classes = createProjectStyle();

  function handleCreateRepository() {
    setStep(1);
  }

  function handleCloneRepository() {
    setStep(1);
  }

  function handleLocalFolder() {
    setStep(1);
  }

  function handleAddProject() {
    setStep(1);
  }

  return (
    <div className={classes.step1}>
      <div className={classes.stepHeader}>Project Start</div>
      <div className={classes.optionWrapper} onClick={handleCreateRepository}>
        <div className={classes.optionIcon}></div>
        <div className={classes.option}>
          <div className={classes.optionHeader}>New Repository</div>
          <div className={classes.optionDescription}>
            Select a project template with code scrapping to get started.
          </div>
        </div>
      </div>
      <div className={classes.optionWrapper} onClick={handleCloneRepository}>
        <div className={classes.optionIcon}></div>
        <div className={classes.option}>
          <div className={classes.optionHeader}>Clone Repository</div>
          <div className={classes.optionDescription}>
            Get code from an online repository such as GitHub or GitLab
          </div>
        </div>
      </div>
      <div className={classes.optionWrapper} onClick={handleLocalFolder}>
        <div className={classes.optionIcon}></div>
        <div className={classes.option}>
          <div className={classes.optionHeader}>Opne Local Folder</div>
          <div className={classes.optionDescription}>
            Navigation and code editing within a folder
          </div>
        </div>
      </div>
      <div className={classes.optionWrapper} onClick={handleAddProject}>
        <div className={classes.optionIcon}></div>
        <div className={classes.option}>
          <div className={classes.optionHeader}>Add Project</div>
          <div className={classes.optionDescription}>
            Add a new project to an existing repository
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({ setStep, setCreateInfo }: TStepProps) {
  const classes = createProjectStyle();

  function handleNext() {
    setStep(2);
  }

  function handleBack() {
    setStep(0);
  }

  return (
    <div className={classes.step2}>
      <div className={classes.stepHeader}>Project Start</div>

      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Project Setting</div>
        <div className={classes.projectInfo}>project name</div>
        <div className={classes.input}>
          <input type="text" />
        </div>
        <div className={classes.projectInfo}>description</div>
        <div className={classes.input}>
          <input type="text" />
        </div>
      </div>

      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Privacy</div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={classes.privacyIcon}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Public</div>
            <div className={classes.privacyDescription}>
              Anyone on the internet can see this repository. You choose who can
              commit.
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={classes.privacyIcon}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Private</div>
            <div className={classes.privacyDescription}>
              You choose who can see and commit to this repository.
            </div>
          </div>
        </div>
      </div>

      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Other Options</div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Add a README file</div>
            <div className={classes.privacyDescription}>
              This is where you can write a long description for your project.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Add .gitignore</div>
            <div className={classes.privacyDescription}>
              Choose which files not to track from a list of templates.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Choose a license</div>
            <div className={classes.privacyDescription}>
              A license tells others what they can and can't do with your code.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.buttonWrapper}>
        <button className={classes.previous} onClick={handleBack}>
          back
        </button>
        <button className={classes.next} onClick={handleNext}>
          next
        </button>
      </div>
    </div>
  );
}

function Step3({ setStep, setCreateInfo }: TStepProps) {
  const classes = createProjectStyle();

  function handleBack() {
    setStep(1);
  }

  function handleCreate() {
    setStep(0);
  }

  return (
    <div className={classes.step3}>
      <div className={classes.stepHeader}>Project Start</div>
      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Server Image</div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={`${classes.privacyIcon} ${classes.centos}`}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>centos</div>
            <div className={classes.privacyDescription}>
              The official build of CentOS.
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={`${classes.privacyIcon} ${classes.ubuntu}`}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>ubuntu</div>
            <div className={classes.privacyDescription}>
              Ubuntu is a Debian-based Linux operating system based on free
              software.
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={`${classes.privacyIcon} ${classes.redhat}`}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>redhat</div>
            <div className={classes.privacyDescription}>
              Red Hat Universal Base Image 8 Minimal
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.radio} type="radio" name="" id="" />
          <div className={`${classes.privacyIcon} ${classes.alpine}`}></div>
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>alpine</div>
            <div className={classes.privacyDescription}>
              A minimal Docker image based on Alpine Linux with a complete
              package index and only 5 MB in size!
            </div>
          </div>
        </div>
      </div>

      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Port</div>
        <div className={classes.projectInfo}>port</div>
        <div className={classes.input}>
          <input type="text" />
        </div>
      </div>

      <div className={classes.optionSection}>
        <div className={classes.subTitle}>Other Options</div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Add a README file</div>
            <div className={classes.privacyDescription}>
              This is where you can write a long description for your project.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Add .gitignore</div>
            <div className={classes.privacyDescription}>
              Choose which files not to track from a list of templates.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
        <div className={classes.privacy}>
          <input className={classes.checkbox} type="checkbox" name="" id="" />
          <div className={classes.privacyText}>
            <div className={classes.privacyTitle}>Choose a license</div>
            <div className={classes.privacyDescription}>
              A license tells others what they can and can't do with your code.
              <span className={classes.learnMore}>Learn more.</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.buttonWrapper}>
        <button className={classes.previous} onClick={handleBack}>
          back
        </button>
        <button className={classes.next} onClick={handleCreate}>
          create
        </button>
      </div>
    </div>
  );
}

const initialCreateInfo: TCreate = {
  repositoryName: "",
  projectName: "",
  newRepository: false,
};

export default function CreateProject() {
  const classes = createProjectStyle();
  const [step, setStep] = useState<number>(0);
  const [createInfo, setCreateInfo] = useState<TCreate>(initialCreateInfo);

  return (
    <div className={classes.stepWrapper}>
      {step === 0 && <Step1 setStep={setStep} setCreateInfo={setCreateInfo} />}
      {step === 1 && <Step2 setStep={setStep} setCreateInfo={setCreateInfo} />}
      {step === 2 && <Step3 setStep={setStep} setCreateInfo={setCreateInfo} />}
    </div>
  );
}
