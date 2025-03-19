import { Html } from "@elysiajs/html"

export interface ProfileCardProps {
    name: string
    message?: string
    linkedInUrl?: string
    githubUrl?: string
}

interface HomeProps {
    initialProfiles: ProfileCardProps[]
}

const Home = ({ initialProfiles }: HomeProps) => {
    return (
        <html lang='en'>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.23/dist/full.min.css" rel="stylesheet" type="text/css" />
                <link rel="icon" type="image/x-icon" href="https://awscc-photobooth.s3.ap-southeast-1.amazonaws.com/assets/upb/logo.png"></link>
                <title>T3-Connect</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script>
                    {`
                    let ws;

                    function connectWebSocket() {
                        ws = new WebSocket('http://localhost:4000/ws`);
                        
                        ws.onopen = () => {
                            console.log('Connected to WebSocket');
                        };

                        ws.onmessage = (event) => {
                            try {
                                const data = JSON.parse(event.data);
                                
                                if (data.type === 'profile') {
                                    // Create new profile element
                                    const container = document.createElement('div');
                                    container.className = 'opacity-0 animate-fade-in';
                                    
                                    // Create profile card HTML
                                    container.innerHTML = \`
                                        <div class="collapse collapse-arrow bg-white/90 backdrop-blur-sm shadow-xl mb-4 rounded-lg border border-sky-100">
                                            <input type="checkbox" /> 
                                            <div class="collapse-title text-xl font-medium text-slate-800">
                                                \${data.data.name}
                                            </div>
                                            <div class="collapse-content">
                                                <div class="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                                    <p class="text-slate-700">\${data.data.message || 'No message provided'}</p>
                                                    <div class="flex gap-4">
                                                        \${data.data.linkedInUrl ? \`
                                                            <a 
                                                                href="\${data.data.linkedInUrl}" 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                class="btn bg-[#0A66C2] hover:bg-[#004182] text-white btn-sm border-none"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                                </svg>
                                                                LinkedIn
                                                            </a>
                                                        \` : ''}
                                                        \${data.data.githubUrl ? \`
                                                            <a 
                                                                href="\${data.data.githubUrl}" 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                class="btn bg-[#24292E] hover:bg-[#1B1F23] text-white btn-sm border-none"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                                </svg>
                                                                GitHub
                                                            </a>
                                                        \` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        \`;
                                    
                                    // Add to the list
                                    document.getElementById('profiles-list').insertBefore(
                                        container,
                                        document.getElementById('profiles-list').firstChild
                                    );
                                } else if (data.type === 'success') {
                                    // Close modal and reset form
                                    document.getElementById('my_modal_3').close();
                                    document.getElementById('profile-form').reset();
                                    
                                    // Reset loading state
                                    const btn = document.getElementById('submit-btn');
                                    const spinner = btn.querySelector('.loading');
                                    btn.disabled = false;
                                    spinner.classList.add('hidden');
                                } else if (data.type === 'initial_profiles') {
                                    // Clear existing profiles
                                    const profilesList = document.getElementById('profiles-list');
                                    profilesList.innerHTML = '';
                                    
                                    // Add all profiles
                                    data.data.forEach(profile => {
                                        const container = document.createElement('div');
                                        container.className = 'opacity-0 animate-fade-in';
                                        container.innerHTML = \`
                                            <div class="collapse collapse-arrow bg-white/90 backdrop-blur-sm shadow-xl mb-4 rounded-lg border border-sky-100">
                                                <input type="checkbox" /> 
                                                <div class="collapse-title text-xl font-medium text-slate-800">
                                                    \${profile.name}
                                                </div>
                                                <div class="collapse-content">
                                                    <div class="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                                        <p class="text-slate-700">\${profile.message || 'No message provided'}</p>
                                                        <div class="flex gap-4">
                                                            \${profile.linkedInUrl ? \`
                                                                <a 
                                                                    href="\${profile.linkedInUrl}" 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    class="btn bg-[#0A66C2] hover:bg-[#004182] text-white btn-sm border-none"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                                    </svg>
                                                                    LinkedIn
                                                                </a>
                                                            \` : ''}
                                                            \${profile.githubUrl ? \`
                                                                <a 
                                                                    href="\${profile.githubUrl}" 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    class="btn bg-[#24292E] hover:bg-[#1B1F23] text-white btn-sm border-none"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                                    </svg>
                                                                    GitHub
                                                                </a>
                                                            \` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        \`;
                                        profilesList.appendChild(container);
                                    });
                                }
                            } catch (e) {
                                console.error('Error handling WebSocket message:', e);
                            }
                        };

                        ws.onclose = () => {
                            console.log('WebSocket connection closed');
                            // Try to reconnect after a delay
                            setTimeout(connectWebSocket, 1000);
                        };

                        ws.onerror = (error) => {
                            console.error('WebSocket error:', error);
                        };
                    }

                    // Connect when the page loads
                    window.addEventListener('load', connectWebSocket);

                    // Function to handle form submission
                    function handleSubmit(event) {
                        event.preventDefault();
                        
                        // Show loading state
                        const btn = document.getElementById('submit-btn');
                        const spinner = btn.querySelector('.loading');
                        btn.disabled = true;
                        spinner.classList.remove('hidden');
                        
                        // Get form data
                        const formData = new FormData(event.target);
                        const data = {
                            name: formData.get('name'),
                            message: formData.get('message'),
                            linkedInUrl: formData.get('linkedInUrl'),
                            githubUrl: formData.get('githubUrl')
                        };
                        
                        // Send via WebSocket
                        ws.send(JSON.stringify(data));
                    }
                    `}
                </script>
                <style>
                    {`
                        @keyframes fade-in {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .animate-fade-in {
                            animation: fade-in 0.5s ease-out forwards;
                        }
                        
                        /* Hide scrollbar for Chrome, Safari and Opera */
                        #profiles-list::-webkit-scrollbar {
                            display: none;
                        }
                        
                        /* Hide scrollbar for IE, Edge and Firefox */
                        #profiles-list {
                            -ms-overflow-style: none;  /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                            height: calc(100vh - 200px); /* Adjust for header and padding */
                        }

                        /* Hide scrollbar for collapse content */
                        .collapse-content div::-webkit-scrollbar {
                            display: none;
                        }
                        
                        .collapse-content div {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                            max-height: calc(100vh - 300px); /* Adjust for header, padding, and collapse title */
                        }
                    `}
                </style>
            </head>
            <body class="min-h-screen bg-gradient-to-b from-sky-200 to-sky-100 bg-cover bg-center" style={{ backgroundImage: `url("https://awscc-photobooth.s3.ap-southeast-1.amazonaws.com/assets/upb/bg.png")`}}>
                <div class="max-w-2xl mx-auto p-8">
                    <div class="flex justify-between items-center mb-5">
                            <img src="https://awscc-photobooth.s3.ap-southeast-1.amazonaws.com/assets/upb/logo.png" alt="Profile" class="w-16 h-16 rounded-full p-2" />
                            <h1 class="text-4xl font-bold text-sky-800 drop-shadow-lg">T3-Connect</h1>
                    </div>

                    <div class="space-y-4 overflow-y-auto scroll-smooth" id="profiles-list">
                        {/* Profiles will be loaded via WebSocket */}
                    </div>
                </div>

                {/* Floating Action Button */}
                <button 
                    class="btn btn-primary btn-circle fixed bottom-8 right-8 shadow-lg text-2xl bg-navy-800 hover:bg-navy-900 text-white border-none"
                    onclick="window.my_modal_3.showModal()"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                <dialog id="my_modal_3" class="modal">
                    <div class="modal-box bg-white/95 backdrop-blur-sm border border-sky-100">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 class="font-bold text-lg mb-4 text-slate-800">Add Your Profile</h3>
                        <form 
                            id="profile-form"
                            class="space-y-4" 
                            onsubmit="handleSubmit(event)"
                        >
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-slate-700">Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="Enter your name" 
                                    class="input input-bordered bg-white/50" 
                                    required 
                                />
                            </div>

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-slate-700">Message</span>
                                </label>
                                <textarea 
                                    name="message"
                                    placeholder="Enter your message" 
                                    class="textarea textarea-bordered h-24 bg-white/50"
                                ></textarea>
                            </div>

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-slate-700">LinkedIn URL</span>
                                </label>
                                <input 
                                    type="url" 
                                    name="linkedInUrl"
                                    placeholder="https://linkedin.com/in/your-profile" 
                                    class="input input-bordered bg-white/50"
                                />
                            </div>

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-slate-700">GitHub URL</span>
                                </label>
                                <input 
                                    type="url" 
                                    name="githubUrl"
                                    placeholder="https://github.com/your-username" 
                                    class="input input-bordered bg-white/50"
                                />
                            </div>

                            <button 
                                id="submit-btn"
                                type="submit" 
                                class="btn btn-primary w-full bg-navy-800 hover:bg-navy-900 text-white border-none relative"
                            >
                                <span class="loading loading-spinner loading-sm hidden absolute left-4"></span>
                                Submit
                            </button>
                        </form>
                    </div>
                </dialog>
            </body>
        </html>
    )
}

export {
    Home
}
