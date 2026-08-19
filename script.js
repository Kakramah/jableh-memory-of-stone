/**
 * جبلة القديمة: ذاكرة الحجر وشهادة البحر
 * جافاسكريبت التفاعل والتحكم السينمائي
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. مؤشر الضوء السينمائي (Spotlight Cursor)
    const cursor = document.querySelector('.spotlight-cursor');
    if (cursor && window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    // 2. شريط تقدم القراءة (Reading Progress Bar)
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressBar) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }
    });

    // 3. اللايت بوكس للصور (Lightbox Modal)
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

    const openLightbox = (imgSrc, captionText) => {
        if (!lightboxModal || !lightboxImg || !lightboxCaption) return;
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText || '';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.interactive-img').forEach((el) => {
        el.addEventListener('click', () => {
            const imgSrc = el.getAttribute('data-img') || el.querySelector('img')?.src;
            const caption = el.getAttribute('data-caption') || el.querySelector('img')?.alt;
            if (imgSrc) {
                openLightbox(imgSrc, caption);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 4. معالجة نموذج سجل الذاكرة والوفاء (Web3Forms Submission)
    const pledgeForm = document.getElementById('memory-pledge-form');
    const submitBtn = document.getElementById('submit-btn');
    const formFeedback = document.getElementById('form-feedback');
    const spinner = submitBtn?.querySelector('.btn-spinner');
    const btnText = submitBtn?.querySelector('.btn-text');

    if (pledgeForm) {
        pledgeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // تجهيز حالة الإرسال
            if (submitBtn) submitBtn.disabled = true;
            if (spinner) spinner.style.display = 'inline-block';
            if (btnText) btnText.textContent = 'جاري تسجيل الرسالة...';
            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = 'form-feedback-box';
            }

            const formData = new FormData(pledgeForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200 && result.success) {
                    if (formFeedback) {
                        formFeedback.style.display = 'block';
                        formFeedback.className = 'form-feedback-box success';
                        formFeedback.innerHTML = '✨ <strong>تم حفظ رسالتك بنجاح في سجل الذاكرة!</strong><br>شكراً لك على هذا الشاهد الإنساني والوفاء لشهداء وأهل جبلة القديمة.';
                    }
                    pledgeForm.reset();
                } else {
                    throw new Error(result.message || 'حدث خطأ أثناء الإرسال');
                }
            } catch (error) {
                if (formFeedback) {
                    formFeedback.style.display = 'block';
                    formFeedback.className = 'form-feedback-box error';
                    formFeedback.innerHTML = '⚠️ <strong>تعذر إرسال الرسالة حالياً.</strong><br>يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.';
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (spinner) spinner.style.display = 'none';
                if (btnText) btnText.textContent = 'تسجيل الرسالة في سجل الذاكرة';
            }
        });
    }

    // 5. ظهور العناصر عند التمرير (Intersection Observer for Reveal)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .gallery-card, .visual-card, .cinematic-quote').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });
});
