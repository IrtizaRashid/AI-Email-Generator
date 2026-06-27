const emailForm = document.getElementById('emailForm');
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const emailOutput = document.getElementById('emailOutput');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const recipientInput = document.getElementById('recipient');
const senderInput = document.getElementById('sender');
const subjectInput = document.getElementById('subject');
const purposeInput = document.getElementById('purpose');
const pointsInput = document.getElementById('points');
const toneInput = document.getElementById('tone');
const lengthInput = document.getElementById('length');
const languageInput = document.getElementById('language');
const instructionsInput = document.getElementById('instructions');
let lastFormData = null;

function init() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle.addEventListener('click', toggleTheme);
    emailForm.addEventListener('submit', handleGenerate);
    regenerateBtn.addEventListener('click', handleRegenerate);
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);
    downloadBtn.addEventListener('click', handleDownload);
    emailOutput.addEventListener('focus', () => {
        emailOutput.removeAttribute('readonly');
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function validateForm() {
    const errors = [];
    if (!recipientInput.value.trim()) errors.push('Recipient name is required');
    if (!senderInput.value.trim()) errors.push('Sender name is required');
    if (!subjectInput.value.trim()) errors.push('Subject is required');
    if (!purposeInput.value.trim()) errors.push('Email purpose is required');
    return { isValid: errors.length === 0, errors: errors };
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    setTimeout(() => errorMessage.classList.remove('active'), 5000);
}

function hideError() {
    errorMessage.classList.remove('active');
}

function showLoading() {
    loadingOverlay.classList.add('active');
    generateBtn.disabled = true;
    regenerateBtn.disabled = true;
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
    generateBtn.disabled = false;
}

function enableActionButtons() {
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    regenerateBtn.disabled = false;
}

function disableActionButtons() {
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    regenerateBtn.disabled = true;
}

async function handleGenerate(event) {
    event.preventDefault();
    const validation = validateForm();
    if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return;
    }
    hideError();
    const formData = {
        recipient: recipientInput.value.trim(),
        sender: senderInput.value.trim(),
        subject: subjectInput.value.trim(),
        purpose: purposeInput.value.trim(),
        points: pointsInput.value.trim(),
        tone: toneInput.value,
        length: lengthInput.value,
        language: languageInput.value.trim() || 'English',
        instructions: instructionsInput.value.trim()
    };
    lastFormData = formData;
    await generateEmail(formData);
}

async function handleRegenerate() {
    if (!lastFormData) {
        showError('No previous email to regenerate');
        return;
    }
    hideError();
    await generateEmail(lastFormData);
}

async function generateEmail(formData) {
    showLoading();
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to generate email');
        if (data.email) {
            emailOutput.value = data.email;
            emailOutput.removeAttribute('readonly');
            enableActionButtons();
        } else {
            throw new Error('No email generated');
        }
    } catch (error) {
        console.error('Error generating email:', error);
        showError(error.message || 'Failed to generate email. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleCopy() {
    if (!emailOutput.value.trim()) {
        showError('No email to copy');
        return;
    }
    try {
        await navigator.clipboard.writeText(emailOutput.value);
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'var(--success)';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = 'var(--success)';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showError('Failed to copy to clipboard');
    }
}

function handleDownload() {
    if (!emailOutput.value.trim()) {
        showError('No email to download');
        return;
    }
    try {
        const subject = subjectInput.value.trim() || 'email';
        const safeSubject = subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeSubject}.txt`;
        const blob = new Blob([emailOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading email:', error);
        showError('Failed to download email');
    }
}

function handleClear() {
    recipientInput.value = '';
    senderInput.value = '';
    subjectInput.value = '';
    purposeInput.value = '';
    pointsInput.value = '';
    toneInput.value = 'Professional';
    lengthInput.value = 'Medium';
    languageInput.value = 'English';
    instructionsInput.value = '';
    emailOutput.value = '';
    emailOutput.setAttribute('readonly', 'true');
    disableActionButtons();
    lastFormData = null;
    hideError();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
