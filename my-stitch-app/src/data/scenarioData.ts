// We use "export const" so other files can grab this data
export const SCENARIO_QUESTIONS = {
    phishing: [
      { text: "What is the first thing you should check in this email?", type: "button_grid" },
      { text: "Is the domain 'corp-services.net' a trusted internal domain?", type: "yes_no_maybe" },
      { text: "Should you open the attached .pdf.exe file in a sandbox?", type: "yes_no_maybe" },
      { text: "Who should you forward this email to?", type: "button_grid" }
    ],
    usb: [
      { text: "Should you plug the USB into your main workstation to check who owns it?", type: "yes_no_maybe" },
      { text: "What type of file is '.lnk' usually associated with?", type: "button_grid" }
    ],
    ransomware: [
      { text: "What is the immediate first step upon discovering ransomware?", type: "button_grid" }
    ]
  };