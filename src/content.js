function experienceHTML() {
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#5577dd">Experience</div>

    <div class="exp-block">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div class="exp-title">JP Morgan Chase</div>
        <span class="exp-date" style="background:#3355aa">Jun 2022 &#x2013; Present</span>
      </div>
      <div class="exp-role">Lead Software Engineer</div>
      <ul class="exp-list">
        <li>React UI deployment platform for 200+ developers on GCP</li>
        <li>70% reduction in deployment complexity &amp; velocity</li>
        <li>75% faster CI/CD via Spinnaker &amp; Harness</li>
        <li>High-performance REST APIs with Dropwizard / Java</li>
      </ul>
      <div style="margin-top:12px">
        ${['React','Java','Dropwizard','GCP','Spinnaker','Harness'].map(t =>
          `<span class="tag" style="background:#0e1628;color:#6688ee">${t}</span>`).join('')}
      </div>
    </div>

    <div class="exp-block" style="border-color:#6633aa">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div class="exp-title">UBS</div>
        <span class="exp-date" style="background:#6633aa">Jul 2019 &#x2013; Jun 2021</span>
      </div>
      <div class="exp-role" style="color:#9966dd">Software Developer</div>
      <ul class="exp-list" style="--arrow:#6633aa">
        <li>AI/NLP automation cutting manual processing time by 80%</li>
        <li>Drools engine for 25,000+ global financial regulation rules</li>
        <li>ReactJS + Python gamification for 20,000+ global users</li>
        <li>Java backend for global client onboarding platform</li>
      </ul>
    </div>

    <div class="exp-block" style="border-color:#444">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div class="exp-title" style="font-size:16px;color:#aaa">UBS &#x2014; Intern</div>
        <span style="font-size:11px;color:#666;padding:2px 8px">Jul &#x2013; Nov 2018</span>
      </div>
      <ul class="exp-list" style="color:#666;font-size:12px">
        <li>Selenium + Java framework validating 2M+ test scenarios</li>
      </ul>
    </div>
  </div>`
}

function skillsHTML() {
  const groups = [
    ['Languages', ['Java','Python','C','C++','JavaScript'], '#6688ee', '#0d1020'],
    ['Backend / Data', ['Spring Boot','Dropwizard','REST APIs','PostgreSQL','MySQL','GraphDB'], '#9966dd', '#120d1e'],
    ['Frontend', ['ReactJS','NodeJS','HTML5','CSS3','Bootstrap'], '#44aa77', '#0a1810'],
    ['Cloud &amp; DevOps', ['GCP','AWS','Azure','Kubernetes','Terraform','Docker','Spinnaker','Harness','Jenkins'], '#cc8833', '#1a1208'],
    ['Observability', ['Datadog','Splunk','Dynatrace'], '#cc4444', '#1a0a0a'],
  ]
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#5577dd">Skills</div>
    ${groups.map(([cat, tags, color, bg]) => `
      <div style="margin-bottom:20px">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:${color};margin-bottom:8px">${cat.toUpperCase()}</div>
        <div>${tags.map(t => `<span class="tag" style="background:${bg};color:${color}">${t}</span>`).join('')}</div>
      </div>`).join('')}
  </div>`
}

function projectsHTML() {
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#5577dd">Projects</div>
    <div style="background:#12121e;border:1px solid rgba(60,60,120,0.4);border-radius:10px;padding:20px;margin-bottom:16px">
      <div style="font-size:17px;font-weight:700;color:#e8e4de;margin-bottom:6px">Pothole Detection System</div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        ${['AWS','CNN','MobileNet'].map(t => `<span class="tag" style="background:#0d1020;color:#6688ee;padding:2px 8px">${t}</span>`).join('')}
      </div>
      <p style="font-size:13px;color:#888;line-height:1.7">Real-time pothole detection using MobileNet CNN. Published and presented at ICIAMR 2019 conference.</p>
    </div>
    <div style="background:#12121e;border:1px solid rgba(60,60,120,0.4);border-radius:10px;padding:20px">
      <div style="font-size:17px;font-weight:700;color:#e8e4de;margin-bottom:6px">ParkSafe</div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        ${['Flask','OpenStreetMap'].map(t => `<span class="tag" style="background:#0a1810;color:#44aa77;padding:2px 8px">${t}</span>`).join('')}
      </div>
      <p style="font-size:13px;color:#888;line-height:1.7">Safety-focused app using processed crime statistics to provide safety scores for parking spots.</p>
    </div>
  </div>`
}

function educationHTML() {
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#44aa77">Education</div>
    <div style="background:#12121e;border:1px solid rgba(40,80,40,0.4);border-radius:10px;padding:24px;margin-bottom:16px">
      <div style="font-size:17px;font-weight:700;color:#e8e4de;margin-bottom:4px">Santa Clara University</div>
      <div style="font-size:13px;color:#44aa77;margin-bottom:10px;font-weight:600">MS in Computer Science &amp; Engineering</div>
      <div style="font-size:36px;font-weight:900;color:#e8e4de">3.815 <span style="font-size:16px;color:#555;font-weight:400">/ 4.0</span></div>
    </div>
    <div style="background:#12121e;border:1px solid rgba(40,80,40,0.4);border-radius:10px;padding:24px">
      <div style="font-size:17px;font-weight:700;color:#e8e4de;margin-bottom:4px">VIT Pune, India</div>
      <div style="font-size:13px;color:#44aa77;margin-bottom:10px;font-weight:600">B.Tech in Computer Engineering</div>
      <div style="font-size:36px;font-weight:900;color:#e8e4de">3.64 <span style="font-size:16px;color:#555;font-weight:400">/ 4.0</span></div>
    </div>
  </div>`
}

function impactHTML() {
  const stats = [
    ['200+','Developers impacted','#6688ee'],
    ['80%','Processing latency cut','#cc8833'],
    ['75%','Faster CI/CD delivery','#44aa77'],
    ['70%','Deployment complexity reduced','#9966dd'],
    ['25k+','Financial rules managed','#cc8833'],
    ['20k+','Global users engaged','#cc4444'],
  ]
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#cc8833">Impact</div>
    <div class="stat-grid">
      ${stats.map(([n,l,c]) => `
        <div class="stat-card">
          <div class="stat-number" style="color:${c}">${n}</div>
          <div class="stat-label">${l}</div>
        </div>`).join('')}
    </div>
  </div>`
}

function contactHTML() {
  return `<div class="content-panel">
    <button class="close-btn" id="close-btn">&#x2715;</button>
    <div class="section-label" style="color:#cc8833">Contact</div>
    <div style="text-align:center;margin-bottom:28px;padding:20px 0 16px">
      <div style="font-size:28px;font-weight:900;color:#e8e4de">Ayush Salunke</div>
      <div style="font-size:14px;color:#666;margin-top:6px">Senior Software Engineer &#xB7; Open to opportunities</div>
    </div>
    <a href="mailto:ayush.salunke250497@gmail.com" class="contact-link">
      <span style="font-size:24px">&#x2709;&#xFE0F;</span>
      <div>
        <div class="contact-type" style="color:#cc8833">EMAIL</div>
        <div class="contact-value">ayush.salunke250497@gmail.com</div>
      </div>
    </a>
    <a href="https://linkedin.com/in/ayush-salunke" target="_blank" rel="noopener" class="contact-link">
      <span style="font-size:24px">&#x1F4BC;</span>
      <div>
        <div class="contact-type" style="color:#4488cc">LINKEDIN</div>
        <div class="contact-value">linkedin.com/in/ayush-salunke</div>
      </div>
    </a>
    <a href="tel:6692209962" class="contact-link">
      <span style="font-size:24px">&#x1F4DE;</span>
      <div>
        <div class="contact-type" style="color:#44aa77">PHONE</div>
        <div class="contact-value">(669) 220-9962</div>
      </div>
    </a>
  </div>`
}

const generators = {
  experience: experienceHTML,
  skills: skillsHTML,
  projects: projectsHTML,
  education: educationHTML,
  impact: impactHTML,
  contact: contactHTML,
}

export function showContent(key, onClose) {
  const overlay = document.getElementById('content-overlay')
  const parser = new DOMParser()
  const doc = parser.parseFromString(generators[key](), 'text/html')
  overlay.replaceChildren(...Array.from(doc.body.childNodes))
  overlay.classList.remove('hidden')
  overlay.querySelector('#close-btn').addEventListener('click', () => {
    overlay.classList.add('hidden')
    onClose()
  })
}

export function hideContent() {
  document.getElementById('content-overlay').classList.add('hidden')
}
