/**
 * NPS HOPEFARM - CBSE AGE ELIGIBILITY CALCULATOR
 * Evaluates child birthdate against CBSE June 1st academic cutoff guidelines
 */

function initAgeCalculator() {
  const dobInput = document.getElementById('dob-calculator-input');
  const calcBtn = document.getElementById('btn-calculate-age');
  const resultGrade = document.getElementById('calc-result-grade');
  const resultText = document.getElementById('calc-result-detail');

  if (!dobInput || !calcBtn) return;

  function calculateEligibility() {
    const dobValue = dobInput.value;
    if (!dobValue) {
      alert("Please select your child's date of birth.");
      return;
    }

    const dob = new Date(dobValue);
    // Academic Year 2027-28 Cutoff Date: June 1, 2027
    const cutoff = new Date('2027-06-01');

    if (dob > cutoff) {
      resultGrade.textContent = "Future Batch";
      resultText.textContent = "Child is not yet eligible for Academic Year 2027-2028.";
      return;
    }

    // Calculate age in years, months
    let years = cutoff.getFullYear() - dob.getFullYear();
    let months = cutoff.getMonth() - dob.getMonth();
    if (months < 0 || (months === 0 && cutoff.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }

    const ageInDecimal = years + (months / 12);

    let eligibleClass = "";
    let guidance = "";

    if (ageInDecimal < 3.0) {
      eligibleClass = "Toddler / Pre-Nursery";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Eligible for future preschool batch.`;
    } else if (ageInDecimal >= 3.0 && ageInDecimal < 4.0) {
      eligibleClass = "Montessori / Pre-KG (Nursery)";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Fully eligible for the 2027-28 Foundation Stage.`;
    } else if (ageInDecimal >= 4.0 && ageInDecimal < 5.0) {
      eligibleClass = "LKG (Kindergarten I)";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Eligible for Kindergarten Transition.`;
    } else if (ageInDecimal >= 5.0 && ageInDecimal < 6.0) {
      eligibleClass = "UKG (Kindergarten II)";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Eligible for UKG preparatory grade.`;
    } else if (ageInDecimal >= 6.0 && ageInDecimal < 7.0) {
      eligibleClass = "Grade I";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Meets standard NEP/CBSE criteria (minimum 6 years for Grade I).`;
    } else if (ageInDecimal >= 7.0 && ageInDecimal < 8.0) {
      eligibleClass = "Grade II";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Subject to previous academic report card.`;
    } else if (ageInDecimal >= 8.0 && ageInDecimal < 9.0) {
      eligibleClass = "Grade III";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Subject to vacancy & assessment.`;
    } else if (ageInDecimal >= 9.0 && ageInDecimal < 10.0) {
      eligibleClass = "Grade IV";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Assessment required for admission.`;
    } else if (ageInDecimal >= 10.0 && ageInDecimal < 11.0) {
      eligibleClass = "Grade V";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Subject to seat vacancy.`;
    } else if (ageInDecimal >= 11.0 && ageInDecimal < 12.0) {
      eligibleClass = "Grade VI";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Pre-CBSE foundation stage.`;
    } else if (ageInDecimal >= 12.0 && ageInDecimal < 13.0) {
      eligibleClass = "Grade VII";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Middle school entry.`;
    } else if (ageInDecimal >= 13.0 && ageInDecimal < 14.5) {
      eligibleClass = "Grade VIII";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Senior entry for current session.`;
    } else {
      eligibleClass = "Higher Secondary Inquiries";
      guidance = `Age as of June 1, 2027: ${years} yrs ${months} mos. Please contact school administration directly.`;
    }

    resultGrade.textContent = eligibleClass;
    resultText.textContent = guidance;

    // Trigger pulse effect
    resultGrade.classList.remove('fade-in');
    void resultGrade.offsetWidth;
    resultGrade.classList.add('fade-in');
  }

  calcBtn.addEventListener('click', calculateEligibility);
  dobInput.addEventListener('change', calculateEligibility);
}

document.addEventListener('DOMContentLoaded', initAgeCalculator);
