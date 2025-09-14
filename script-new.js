// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Scroll Progress Indicator
function updateScrollIndicator() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let indicator = document.querySelector('.scroll-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollIndicator);

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe elements
function initAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('slide-in-left');
        observer.observe(heroContent);
    }

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.classList.add('slide-in-right');
        observer.observe(heroImage);
    }

    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${(index % 10) * 0.1}s`;
        observer.observe(card);
    });

    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach(title => {
        title.classList.add('slide-in-left');
        observer.observe(title);
    });

    const toolsSubtitle = document.querySelector('.tools-subtitle');
    if (toolsSubtitle) {
        toolsSubtitle.classList.add('fade-in');
        observer.observe(toolsSubtitle);
    }

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    const platformBtns = document.querySelectorAll('.platform-btn');
    platformBtns.forEach((btn, index) => {
        btn.classList.add('fade-in');
        btn.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(btn);
    });

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('fade-in');
        observer.observe(title);
    });
}

// Backend Status Check
async function checkBackendStatus() {
    try {
        const response = await fetch('http://localhost:3000/health');
        return response.ok;
    } catch (error) {
        console.error('Backend check failed:', error);
        return false;
    }
}

// Show processing modal
function showProcessingModal(toolName) {
    const supportedFormats = getSupportedFormats(toolName);
    const acceptTypes = getAcceptTypes(toolName);
    const isMultiple = toolName === 'Merge PDF' || toolName === 'JPG to PDF';
    
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.9); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                <div style="font-size: 3rem; color: #FF6B6B; margin-bottom: 20px;">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">${toolName}</h3>
                <p style="color: #666; margin-bottom: 25px;">Upload your ${isMultiple ? 'files' : 'file'} to process with ${toolName}</p>
                
                <div style="border: 2px dashed #4ECDC4; padding: 30px; border-radius: 10px; margin-bottom: 20px; cursor: pointer; transition: all 0.3s ease;" class="upload-area">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: #4ECDC4; margin-bottom: 10px;"></i>
                    <p style="color: #666; margin: 0;">Click here to select ${isMultiple ? 'files' : 'file'} or drag & drop</p>
                    <p style="color: #999; margin: 5px 0 0 0; font-size: 0.85rem;">Supported: ${supportedFormats}</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="process-btn" style="background: linear-gradient(135deg, #FF6B6B, #4ECDC4); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; opacity: 0.5;" disabled>Process ${isMultiple ? 'Files' : 'File'}</button>
                    <button class="cancel-btn" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
                </div>
                
                <input type="file" class="file-input" style="display: none;" accept="${acceptTypes}" ${isMultiple ? 'multiple' : ''}>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const uploadArea = modal.querySelector('.upload-area');
    const processBtn = modal.querySelector('.process-btn');
    const fileInput = modal.querySelector('.file-input');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    // Cancel button event
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const allowedExts = getAllowedExtensions(toolName);
            
            // Validate all files
            const invalidFiles = files.filter(file => {
                const fileExt = file.name.split('.').pop().toLowerCase();
                return !allowedExts.includes(fileExt);
            });
            
            if (invalidFiles.length > 0) {
                uploadArea.innerHTML = `
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #dc3545; margin-bottom: 10px;"></i>
                    <p style="color: #dc3545; margin: 0; font-weight: 600;">Invalid file type(s)</p>
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 0.9rem;">Please select: ${getSupportedFormats(toolName)}</p>
                `;
                processBtn.disabled = true;
                processBtn.style.opacity = '0.5';
                return;
            }
            
            if (files.length === 1) {
                uploadArea.innerHTML = `
                    <i class="fas fa-file-check" style="font-size: 2rem; color: #28a745; margin-bottom: 10px;"></i>
                    <p style="color: #28a745; margin: 0; font-weight: 600;">${files[0].name}</p>
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 0.9rem;">Ready for processing</p>
                `;
            } else {
                uploadArea.innerHTML = `
                    <i class="fas fa-file-check" style="font-size: 2rem; color: #28a745; margin-bottom: 10px;"></i>
                    <p style="color: #28a745; margin: 0; font-weight: 600;">${files.length} files selected</p>
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 0.9rem;">Ready for processing</p>
                `;
            }
            
            processBtn.disabled = false;
            processBtn.style.opacity = '1';
        }
    });
    
    processBtn.addEventListener('click', () => {
        if (fileInput.files.length > 0) {
            processFiles(modal, toolName, fileInput.files);
        }
    });
}

// Process files function (handles both single and multiple files)
async function processFiles(modal, toolName, files) {
    const modalContent = modal.querySelector('div > div');
    
    modalContent.innerHTML = `
        <div style="font-size: 3rem; color: #4ECDC4; margin-bottom: 20px;">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing ${toolName}...</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="background: linear-gradient(90deg, #FF6B6B, #4ECDC4); height: 4px; border-radius: 2px; width: 0%; animation: realProgress 3s ease-in-out forwards;"></div>
        </div>
        <p style="color: #666;">Processing your ${files.length > 1 ? 'files' : 'file'}...</p>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes realProgress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(style);
    
    try {
        const formData = new FormData();
        
        // Add files based on tool type
        if (toolName === 'Merge PDF' || toolName === 'JPG to PDF') {
            // Multiple files - use 'files' field name
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            console.log(`Using 'files' field for ${toolName}`);
        } else {
            // Single file - use 'file' field name
            formData.append('file', files[0]);
            console.log(`Using 'file' field for ${toolName}`);
        }
        
        const endpoint = getEndpointForTool(toolName);
        console.log(`Processing ${toolName} with endpoint: ${endpoint}`);
        console.log(`Files count: ${files.length}`);
        
        const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response result:', result);
        console.log('Files in result:', result.files);
        
        if (!response.ok) {
            throw new Error(result.error || 'Processing failed');
        }
        
        // Handle different response types
        if (result.files && result.files.length > 0) {
            console.log('Processing multiple files response');
            // Multiple output files (Split PDF, PDF to JPG)
            const downloadButtons = result.files.map((file, index) => 
                `<div class="page-item" data-page="${file.page || index + 1}" style="display: flex; align-items: center; justify-content: space-between; background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 8px; border: 2px solid transparent;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="page-${file.page || index + 1}" checked style="width: 18px; height: 18px; cursor: pointer;">
                        <label for="page-${file.page || index + 1}" style="cursor: pointer; font-weight: 600; color: #2c3e50;">Page ${file.page || index + 1}</label>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <a href="http://localhost:3000${file.downloadUrl}" download style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block; font-size: 0.9rem;">Download</a>
                        <button onclick="window.removePage(${file.page || index + 1})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">Remove</button>
                    </div>
                </div>`
            ).join('');
            
            modalContent.innerHTML = `
                <div style="font-size: 3rem; color: #28a745; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing Complete!</h3>
                <p style="color: #666; margin-bottom: 20px;">${result.message}</p>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color: #2c3e50; margin: 0;">Select pages to download:</h4>
                        <div>
                            <button onclick="window.selectAll()" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; margin-right: 5px;">Select All</button>
                            <button onclick="window.selectNone()" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">Select None</button>
                        </div>
                    </div>
                    <div style="max-height: 250px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 8px; padding: 10px;">
                        ${downloadButtons}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="window.downloadSelected()" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Download Selected</button>
                    <button id="closeModal" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
                </div>
            `;
            
            // Store modal reference for global functions
            window.currentModal = modal;
            window.currentModalContent = modalContent;
            
            // Add global functions for page management
            window.removePage = function(pageNum) {
                const pageItem = window.currentModalContent.querySelector(`[data-page="${pageNum}"]`);
                if (pageItem) {
                    pageItem.style.opacity = '0.5';
                    pageItem.style.display = 'none';
                    pageItem.querySelector('input[type="checkbox"]').checked = false;
                    
                    // Show feedback
                    const feedback = document.createElement('div');
                    feedback.innerHTML = `<p style="color: #dc3545; font-size: 0.9rem; margin: 5px 0;">Page ${pageNum} removed</p>`;
                    pageItem.parentNode.insertBefore(feedback, pageItem);
                    
                    setTimeout(() => {
                        if (feedback.parentNode) {
                            feedback.remove();
                        }
                    }, 2000);
                }
            };
            
            window.selectAll = function() {
                const checkboxes = window.currentModalContent.querySelectorAll('input[type="checkbox"]');
                const pageItems = window.currentModalContent.querySelectorAll('.page-item');
                checkboxes.forEach((cb, index) => {
                    cb.checked = true;
                    pageItems[index].style.display = 'flex';
                    pageItems[index].style.opacity = '1';
                });
            };
            
            window.selectNone = function() {
                const checkboxes = window.currentModalContent.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
            };
            
            window.downloadSelected = function() {
                const checkedBoxes = window.currentModalContent.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedBoxes.length === 0) {
                    // Better alert styling
                    const alertDiv = document.createElement('div');
                    alertDiv.innerHTML = `
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center;">
                            <i class="fas fa-exclamation-triangle"></i> Please select at least one page to download
                        </div>
                    `;
                    window.currentModalContent.insertBefore(alertDiv, window.currentModalContent.lastElementChild);
                    
                    setTimeout(() => {
                        if (alertDiv.parentNode) {
                            alertDiv.remove();
                        }
                    }, 3000);
                    return;
                }
                
                // Download feedback
                const downloadFeedback = document.createElement('div');
                downloadFeedback.innerHTML = `
                    <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center;">
                        <i class="fas fa-download"></i> Downloading ${checkedBoxes.length} page(s)...
                    </div>
                `;
                window.currentModalContent.insertBefore(downloadFeedback, window.currentModalContent.lastElementChild);
                
                checkedBoxes.forEach((checkbox, index) => {
                    setTimeout(() => {
                        const pageItem = checkbox.closest('.page-item');
                        const downloadLink = pageItem.querySelector('a[download]');
                        const link = document.createElement('a');
                        link.href = downloadLink.href;
                        link.download = downloadLink.download;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, index * 500); // Stagger downloads
                });
                
                setTimeout(() => {
                    if (downloadFeedback.parentNode) {
                        downloadFeedback.remove();
                    }
                }, 5000);
            };
            
            // Add close event listener
            modalContent.querySelector('#closeModal').addEventListener('click', () => {
                modal.remove();
            });
        } else {
            // Single output file
            modalContent.innerHTML = `
                <div style="font-size: 3rem; color: #28a745; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing Complete!</h3>
                <p style="color: #666; margin-bottom: 25px;">${result.message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="http://localhost:3000${result.downloadUrl}" download style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block;">Download Result</a>
                    <button id="closeModal" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
                </div>
            `;
            
            // Add close event listener
            modalContent.querySelector('#closeModal').addEventListener('click', () => {
                modal.remove();
            });
        }
        
    } catch (error) {
        console.error('Processing error:', error);
        modalContent.innerHTML = `
            <div style="font-size: 3rem; color: #dc3545; margin-bottom: 20px;">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing Failed</h3>
            <p style="color: #666; margin-bottom: 25px;">Error: ${error.message}</p>
            <button id="closeModal" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
        `;
        
        // Add close event listener
        modalContent.querySelector('#closeModal').addEventListener('click', () => {
            modal.remove();
        });
    }
}
async function processFile(modal, toolName, file) {
    const modalContent = modal.querySelector('div > div');
    
    modalContent.innerHTML = `
        <div style="font-size: 3rem; color: #4ECDC4; margin-bottom: 20px;">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing ${toolName}...</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="background: linear-gradient(90deg, #FF6B6B, #4ECDC4); height: 4px; border-radius: 2px; width: 0%; animation: realProgress 3s ease-in-out forwards;"></div>
        </div>
        <p style="color: #666;">Processing your file...</p>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes realProgress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(style);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const endpoint = getEndpointForTool(toolName);
        console.log(`Processing ${toolName} with endpoint: ${endpoint}`);
        console.log(`File details:`, file.name, file.type, file.size);
        
        const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response result:', result);
        
        if (!response.ok) {
            throw new Error(result.error || 'Processing failed');
        }
        
        modalContent.innerHTML = `
            <div style="font-size: 3rem; color: #28a745; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing Complete!</h3>
            <p style="color: #666; margin-bottom: 25px;">${result.message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="http://localhost:3000${result.downloadUrl}" download style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block;">Download Result</a>
                <button onclick="this.closest('div').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
            </div>
        `;
        
    } catch (error) {
        console.error('Processing error:', error);
        modalContent.innerHTML = `
            <div style="font-size: 3rem; color: #dc3545; margin-bottom: 20px;">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Processing Failed</h3>
            <p style="color: #666; margin-bottom: 25px;">Error: ${error.message}</p>
            <button onclick="this.closest('div').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
        `;
    } finally {
        style.remove();
    }
}

// Backend not running modal
function showBackendNotRunningModal(toolName) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.9); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                <div style="font-size: 3rem; color: #FF6B6B; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Backend Server Required</h3>
                <p style="color: #666; margin-bottom: 25px;">To use ${toolName}, please ensure the backend server is running</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-family: monospace; text-align: left;">
                    <div style="color: #333; margin-bottom: 5px;">npm install</div>
                    <div style="color: #333;">npm start</div>
                </div>
                <button onclick="this.closest('div').remove()" style="background: linear-gradient(135deg, #FF6B6B, #4ECDC4); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Got it!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Map tool names to API endpoints
function getEndpointForTool(toolName) {
    const toolMap = {
        'Compress PDF': 'compress-pdf',
        'Merge PDF': 'merge-pdf',
        'Split PDF': 'split-pdf',
        'JPG to PDF': 'jpg-to-pdf',
        'PDF to JPG': 'pdf-to-jpg',
        'Add Watermark': 'add-watermark',
        'Rotate PDF': 'rotate-pdf'
    };
    
    return toolMap[toolName] || 'compress-pdf';
}

function getSupportedFormats(toolName) {
    const formatMap = {
        'JPG to PDF': 'JPG, PNG, GIF, BMP',
        'Compress PDF': 'PDF only',
        'Merge PDF': 'PDF only',
        'Split PDF': 'PDF only',
        'PDF to JPG': 'PDF only',
        'Add Watermark': 'PDF only',
        'Rotate PDF': 'PDF only'
    };
    
    return formatMap[toolName] || 'PDF only';
}

function getAcceptTypes(toolName) {
    const acceptMap = {
        'JPG to PDF': '.jpg,.jpeg,.png,.gif,.bmp',
        'Compress PDF': '.pdf',
        'Merge PDF': '.pdf',
        'Split PDF': '.pdf',
        'PDF to JPG': '.pdf',
        'Add Watermark': '.pdf',
        'Rotate PDF': '.pdf'
    };
    
    return acceptMap[toolName] || '.pdf';
}

function getAllowedExtensions(toolName) {
    const extMap = {
        'JPG to PDF': ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
        'Compress PDF': ['pdf'],
        'Merge PDF': ['pdf'],
        'Split PDF': ['pdf'],
        'PDF to JPG': ['pdf'],
        'Add Watermark': ['pdf'],
        'Rotate PDF': ['pdf']
    };
    
    return extMap[toolName] || ['pdf'];
}

// Setup tool interactions
function setupToolInteractions() {
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', async () => {
            const toolName = card.querySelector('h4').textContent;
            console.log('Tool clicked:', toolName);
            
            try {
                const backendRunning = await checkBackendStatus();
                
                if (!backendRunning) {
                    showBackendNotRunningModal(toolName);
                    return;
                }
                
                showProcessingModal(toolName);
                
            } catch (error) {
                console.error('Error clicking tool:', error);
                showBackendNotRunningModal(toolName);
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 PDF Mobile website loaded successfully!');
    
    initAnimations();
    
    // Setup tool interactions after a small delay
    setTimeout(() => {
        setupToolInteractions();
    }, 500);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

console.log('Script loaded and ready!');
 / /   E d i t   P D F   M o d a l   F u n c t i o n s 
 f u n c t i o n   o p e n E d i t M o d a l ( )   { 
         c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' e d i t P d f M o d a l ' ) ; 
         m o d a l . s t y l e . d i s p l a y   =   ' b l o c k ' ; 
         d o c u m e n t . b o d y . s t y l e . o v e r f l o w   =   ' h i d d e n ' ; 
         
         / /   A d d   e n t r a n c e   a n i m a t i o n 
         s e t T i m e o u t ( ( )   = >   { 
                 m o d a l . s t y l e . o p a c i t y   =   ' 1 ' ; 
         } ,   1 0 ) ; 
 } 
 
 f u n c t i o n   c l o s e E d i t M o d a l ( )   { 
         c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' e d i t P d f M o d a l ' ) ; 
         m o d a l . s t y l e . o p a c i t y   =   ' 0 ' ; 
         
         s e t T i m e o u t ( ( )   = >   { 
                 m o d a l . s t y l e . d i s p l a y   =   ' n o n e ' ; 
                 d o c u m e n t . b o d y . s t y l e . o v e r f l o w   =   ' a u t o ' ; 
         } ,   3 0 0 ) ; 
 } 
 
 / /   C l o s e   m o d a l   w h e n   c l i c k i n g   o u t s i d e 
 d o c u m e n t . a d d E v e n t L i s t e n e r ( ' c l i c k ' ,   f u n c t i o n ( e v e n t )   { 
         c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' e d i t P d f M o d a l ' ) ; 
         i f   ( e v e n t . t a r g e t   = = =   m o d a l )   { 
                 c l o s e E d i t M o d a l ( ) ; 
         } 
 } ) ; 
 
 / /   E s c a p e   k e y   t o   c l o s e   m o d a l 
 d o c u m e n t . a d d E v e n t L i s t e n e r ( ' k e y d o w n ' ,   f u n c t i o n ( e v e n t )   { 
         i f   ( e v e n t . k e y   = = =   ' E s c a p e ' )   { 
                 c l o s e E d i t M o d a l ( ) ; 
         } 
 } ) ; 
 
 f u n c t i o n   o p e n T o o l ( t o o l T y p e )   { 
         / /   S h o w   a   n o t i f i c a t i o n   t h a t   t o o l   i s   o p e n i n g 
         s h o w N o t i f i c a t i o n ( ` O p e n i n g   $ { t o o l T y p e . r e p l a c e ( ' - ' ,   '   ' ) }   t o o l . . . ` ,   ' i n f o ' ) ; 
         
         / /   C l o s e   t h e   m o d a l   f i r s t 
         c l o s e E d i t M o d a l ( ) ; 
         
         / /   B a s e d   o n   t o o l   t y p e ,   o p e n   a p p r o p r i a t e   f u n c t i o n a l i t y 
         s e t T i m e o u t ( ( )   = >   { 
                 s w i t c h ( t o o l T y p e )   { 
                         c a s e   ' c r o p ' : 
                                 o p e n C r o p T o o l ( ) ; 
                                 b r e a k ; 
                         c a s e   ' a d d - t e x t ' : 
                                 o p e n A d d T e x t T o o l ( ) ; 
                                 b r e a k ; 
                         c a s e   ' r e m o v e - p a g e s ' : 
                                 o p e n R e m o v e P a g e s T o o l ( ) ; 
                                 b r e a k ; 
                         c a s e   ' a d d - s h a p e s ' : 
                                 o p e n A d d S h a p e s T o o l ( ) ; 
                                 b r e a k ; 
                         c a s e   ' h i g h l i g h t ' : 
                                 o p e n H i g h l i g h t T o o l ( ) ; 
                                 b r e a k ; 
                         c a s e   ' s i g n a t u r e ' : 
                                 o p e n S i g n a t u r e T o o l ( ) ; 
                                 b r e a k ; 
                         d e f a u l t : 
                                 s h o w N o t i f i c a t i o n ( ' T h i s   t o o l   i s   c o m i n g   s o o n ! ' ,   ' w a r n i n g ' ) ; 
                 } 
         } ,   3 0 0 ) ; 
 } 
 
 f u n c t i o n   o p e n C r o p T o o l ( )   { 
         / /   C r e a t e   f i l e   i n p u t   f o r   P D F   u p l o a d 
         c o n s t   f i l e I n p u t   =   d o c u m e n t . c r e a t e E l e m e n t ( ' i n p u t ' ) ; 
         f i l e I n p u t . t y p e   =   ' f i l e ' ; 
         f i l e I n p u t . a c c e p t   =   ' . p d f ' ; 
         f i l e I n p u t . s t y l e . d i s p l a y   =   ' n o n e ' ; 
         
         f i l e I n p u t . o n c h a n g e   =   f u n c t i o n ( e )   { 
                 c o n s t   f i l e   =   e . t a r g e t . f i l e s [ 0 ] ; 
                 i f   ( f i l e )   { 
                         s h o w N o t i f i c a t i o n ( ' C r o p   P D F   t o o l   -   C o m i n g   S o o n !   F i l e   s e l e c t e d :   '   +   f i l e . n a m e ,   ' i n f o ' ) ; 
                         / /   H e r e   y o u   w o u l d   i m p l e m e n t   a c t u a l   c r o p   f u n c t i o n a l i t y 
                 } 
         } ; 
         
         d o c u m e n t . b o d y . a p p e n d C h i l d ( f i l e I n p u t ) ; 
         f i l e I n p u t . c l i c k ( ) ; 
         d o c u m e n t . b o d y . r e m o v e C h i l d ( f i l e I n p u t ) ; 
 } 
 
 f u n c t i o n   o p e n A d d T e x t T o o l ( )   { 
         s h o w N o t i f i c a t i o n ( ' A d d   T e x t   t o o l   -   U p l o a d   a   P D F   t o   a d d   t e x t   a n n o t a t i o n s ' ,   ' i n f o ' ) ; 
         / /   C r e a t e   f i l e   i n p u t 
         c o n s t   f i l e I n p u t   =   d o c u m e n t . c r e a t e E l e m e n t ( ' i n p u t ' ) ; 
         f i l e I n p u t . t y p e   =   ' f i l e ' ; 
         f i l e I n p u t . a c c e p t   =   ' . p d f ' ; 
         f i l e I n p u t . o n c h a n g e   =   f u n c t i o n ( e )   { 
                 c o n s t   f i l e   =   e . t a r g e t . f i l e s [ 0 ] ; 
                 i f   ( f i l e )   { 
                         s h o w N o t i f i c a t i o n ( ' A d d   T e x t   t o o l   -   C o m i n g   S o o n !   F i l e :   '   +   f i l e . n a m e ,   ' i n f o ' ) ; 
                 } 
         } ; 
         f i l e I n p u t . c l i c k ( ) ; 
 } 
 
 f u n c t i o n   o p e n R e m o v e P a g e s T o o l ( )   { 
         s h o w N o t i f i c a t i o n ( ' R e m o v e   P a g e s   t o o l   -   U p l o a d   a   P D F   t o   r e m o v e   s p e c i f i c   p a g e s ' ,   ' i n f o ' ) ; 
         c o n s t   f i l e I n p u t   =   d o c u m e n t . c r e a t e E l e m e n t ( ' i n p u t ' ) ; 
         f i l e I n p u t . t y p e   =   ' f i l e ' ; 
         f i l e I n p u t . a c c e p t   =   ' . p d f ' ; 
         f i l e I n p u t . o n c h a n g e   =   f u n c t i o n ( e )   { 
                 c o n s t   f i l e   =   e . t a r g e t . f i l e s [ 0 ] ; 
                 i f   ( f i l e )   { 
                         s h o w N o t i f i c a t i o n ( ' R e m o v e   P a g e s   t o o l   -   C o m i n g   S o o n !   F i l e :   '   +   f i l e . n a m e ,   ' i n f o ' ) ; 
                 } 
         } ; 
         f i l e I n p u t . c l i c k ( ) ; 
 } 
 
 f u n c t i o n   o p e n A d d S h a p e s T o o l ( )   { 
         s h o w N o t i f i c a t i o n ( ' A d d   S h a p e s   t o o l   -   C o m i n g   S o o n ! ' ,   ' w a r n i n g ' ) ; 
 } 
 
 f u n c t i o n   o p e n H i g h l i g h t T o o l ( )   { 
         s h o w N o t i f i c a t i o n ( ' H i g h l i g h t   T e x t   t o o l   -   C o m i n g   S o o n ! ' ,   ' w a r n i n g ' ) ; 
 } 
 
 f u n c t i o n   o p e n S i g n a t u r e T o o l ( )   { 
         s h o w N o t i f i c a t i o n ( ' A d d   S i g n a t u r e   t o o l   -   C o m i n g   S o o n ! ' ,   ' w a r n i n g ' ) ; 
 } 
 
 / /   N o t i f i c a t i o n   s y s t e m   f o r   u s e r   f e e d b a c k 
 f u n c t i o n   s h o w N o t i f i c a t i o n ( m e s s a g e ,   t y p e   =   ' i n f o ' )   { 
         / /   R e m o v e   e x i s t i n g   n o t i f i c a t i o n s 
         c o n s t   e x i s t i n g N o t i f i c a t i o n s   =   d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . n o t i f i c a t i o n ' ) ; 
         e x i s t i n g N o t i f i c a t i o n s . f o r E a c h ( n o t i f   = >   n o t i f . r e m o v e ( ) ) ; 
         
         / /   C r e a t e   n o t i f i c a t i o n   e l e m e n t 
         c o n s t   n o t i f i c a t i o n   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
         n o t i f i c a t i o n . c l a s s N a m e   =   ` n o t i f i c a t i o n   n o t i f i c a t i o n - $ { t y p e } ` ; 
         n o t i f i c a t i o n . i n n e r H T M L   =   ` 
                 < d i v   c l a s s = " n o t i f i c a t i o n - c o n t e n t " > 
                         < i   c l a s s = " f a s   f a - $ { t y p e   = = =   ' i n f o '   ?   ' i n f o - c i r c l e '   :   t y p e   = = =   ' w a r n i n g '   ?   ' e x c l a m a t i o n - t r i a n g l e '   :   ' c h e c k - c i r c l e ' } " > < / i > 
                         < s p a n > $ { m e s s a g e } < / s p a n > 
                         < b u t t o n   c l a s s = " n o t i f i c a t i o n - c l o s e "   o n c l i c k = " t h i s . p a r e n t E l e m e n t . p a r e n t E l e m e n t . r e m o v e ( ) " > & t i m e s ; < / b u t t o n > 
                 < / d i v > 
         ` ; 
         
         / /   A d d   s t y l e s 
         n o t i f i c a t i o n . s t y l e . c s s T e x t   =   ` 
                 p o s i t i o n :   f i x e d ; 
                 t o p :   2 0 p x ; 
                 r i g h t :   2 0 p x ; 
                 z - i n d e x :   1 0 0 0 0 ; 
                 m i n - w i d t h :   3 0 0 p x ; 
                 m a x - w i d t h :   5 0 0 p x ; 
                 b a c k g r o u n d :   $ { t y p e   = = =   ' i n f o '   ?   ' # 3 4 9 8 d b '   :   t y p e   = = =   ' w a r n i n g '   ?   ' # f 3 9 c 1 2 '   :   ' # 2 7 a e 6 0 ' } ; 
                 c o l o r :   w h i t e ; 
                 p a d d i n g :   1 5 p x   2 0 p x ; 
                 b o r d e r - r a d i u s :   1 0 p x ; 
                 b o x - s h a d o w :   0   1 0 p x   2 5 p x   r g b a ( 0 , 0 , 0 , 0 . 2 ) ; 
                 a n i m a t i o n :   s l i d e I n R i g h t   0 . 3 s   e a s e - o u t ; 
                 c u r s o r :   p o i n t e r ; 
         ` ; 
         
         n o t i f i c a t i o n . q u e r y S e l e c t o r ( ' . n o t i f i c a t i o n - c o n t e n t ' ) . s t y l e . c s s T e x t   =   ` 
                 d i s p l a y :   f l e x ; 
                 a l i g n - i t e m s :   c e n t e r ; 
                 g a p :   1 0 p x ; 
         ` ; 
         
         n o t i f i c a t i o n . q u e r y S e l e c t o r ( ' . n o t i f i c a t i o n - c l o s e ' ) . s t y l e . c s s T e x t   =   ` 
                 b a c k g r o u n d :   n o n e ; 
                 b o r d e r :   n o n e ; 
                 c o l o r :   w h i t e ; 
                 f o n t - s i z e :   1 8 p x ; 
                 m a r g i n - l e f t :   a u t o ; 
                 c u r s o r :   p o i n t e r ; 
                 p a d d i n g :   0 ; 
                 w i d t h :   2 0 p x ; 
                 h e i g h t :   2 0 p x ; 
         ` ; 
         
         d o c u m e n t . b o d y . a p p e n d C h i l d ( n o t i f i c a t i o n ) ; 
         
         / /   A u t o   r e m o v e   a f t e r   5   s e c o n d s 
         s e t T i m e o u t ( ( )   = >   { 
                 i f   ( n o t i f i c a t i o n . p a r e n t E l e m e n t )   { 
                         n o t i f i c a t i o n . s t y l e . a n i m a t i o n   =   ' s l i d e O u t R i g h t   0 . 3 s   e a s e - i n ' ; 
                         s e t T i m e o u t ( ( )   = >   n o t i f i c a t i o n . r e m o v e ( ) ,   3 0 0 ) ; 
                 } 
         } ,   5 0 0 0 ) ; 
 } 
 
 / /   A d d   C S S   a n i m a t i o n s   f o r   n o t i f i c a t i o n s 
 c o n s t   n o t i f i c a t i o n S t y l e s   =   d o c u m e n t . c r e a t e E l e m e n t ( ' s t y l e ' ) ; 
 n o t i f i c a t i o n S t y l e s . t e x t C o n t e n t   =   ` 
         @ k e y f r a m e s   s l i d e I n R i g h t   { 
                 f r o m   { 
                         t r a n s f o r m :   t r a n s l a t e X ( 1 0 0 % ) ; 
                         o p a c i t y :   0 ; 
                 } 
                 t o   { 
                         t r a n s f o r m :   t r a n s l a t e X ( 0 ) ; 
                         o p a c i t y :   1 ; 
                 } 
         } 
         
         @ k e y f r a m e s   s l i d e O u t R i g h t   { 
                 f r o m   { 
                         t r a n s f o r m :   t r a n s l a t e X ( 0 ) ; 
                         o p a c i t y :   1 ; 
                 } 
                 t o   { 
                         t r a n s f o r m :   t r a n s l a t e X ( 1 0 0 % ) ; 
                         o p a c i t y :   0 ; 
                 } 
         } 
 ` ; 
 d o c u m e n t . h e a d . a p p e n d C h i l d ( n o t i f i c a t i o n S t y l e s ) ;  
 