
const isChrome = !!window.chrome;
const versions = [{
  date: '06-10-2019',
  title: 'OCT 06, 2019',
  variant: [{
    data: 'uk',
    title: 'UK & Europe',
  },
  {
    data: 'freelance',
    title: 'With Freelance',
  },
  {
    data: 'universal',
    title: 'Universal',
  }],
  selected: true
},
{
  date: '10-03-2019',
  title: 'MAR 10, 2019',
  variant: [{
    data: 'universal',
    title: 'Universal',
  }]
},

];
const polyfills = [
  ''
];
function loadPolyfills() {

}


$(document).ready(function () {
  // Toogle download btn
  // if (!isChrome) {
  if (true) {
    $('#download-btn').remove();
  }


  // $('[data-toggle="popover"]').popover();
  // load the correct resume
  let selectedVr = "";
  let selectedVar = "";
  const vrDrop = $('.vr-drop');
  const vrDropBtn = vrDrop.find('#vr-drop-btn');
  const varDrop = $('.variant-drop');
  const varDropBtn = varDrop.find('#variant-drop-btn');
  const resumeFr = $('#resume-frame');

  // resumeFr.on('load', function resizeIframe(e) {
  //   this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
  // });

  createVrDropdown();
  fillTheFrame();



  function createVrDropdown() {
    // variant dropdown
    const vrDrop = $('.vr-drop > .dropdown-menu');
    const items = versions.map(ver => {
      const item = $("<a class='dropdown-item'></a>");
      item.data({
        selected: !!ver.selected,
        date: ver.date
      });
      item.attr('href', 'javascript:void(0)');
      item.text(ver.title);
      return item;
    });
    vrDrop.empty();
    vrDrop.append(items);
    attachVersionlistner();
  }

  function createVarDropdown(vr) {
    // variant dropdown
    const varDrop = $('.variant-drop > .dropdown-menu');
    const items = vr['variant'].map(varr => {
      const item = $("<a class='dropdown-item'></a>");
      item.data({
        selected: varr.data === 'universal',
        variant: varr.data
      });
      item.attr('href', 'javascript:void(0)');
      item.text(varr.title);
      return item;
    });
    varDrop.empty();
    varDrop.append(items);
    attachVariantlistner();
  }

  function fillTheFrame() {
    const url = new window.URL(window.location.href);
    const fragement = url.hash;
    const params = url.searchParams;
    const getVr = fragement && fragement.startsWith(`#resume-`) && versions.find(vr => vr["date"] === fragement.split(`#resume-`)[1]) || versions.find(vr => vr["selected"]);
    const getVar = params && params.has('var') && getVr['variant'].find(vrr => vrr["data"] === params.get('var')) || getVr['variant'].find(vrr => vrr["data"] === 'universal');
    selectedVr = getVr['date'];
    selectedVar = getVar['data'];
    vrDropBtn.text(getVr['title']);
    varDropBtn.text(getVar['title']);
    setFrame(getVr['date'], getVar['data']);
    createVarDropdown(getVr);
  }

  function setFrame(date, variant) {
    resumeFr.prop("src", `resume-${date}/${variant !== 'universal' ? variant + '/' : ''}index.html`);
  }

  function attachVersionlistner() {
    vrDropBtn.next().find('.dropdown-item').on('click', function () {
      const version = versions.find(r => r['date'] === $(this).data('date'));
      createVarDropdown(version);
      if (selectedVr !== version['date']) {
        selectedVr = version['date'];
        vrDropBtn.text(version['title']);
        const url = new URL(window.location.href);
        url.hash = `#resume-${version['date']}`;
        const ifVariant = version['variant'].find(r => r['data'] === selectedVar);
        if (ifVariant) {
          varDropBtn.text(ifVariant['title']);
          url.searchParams.set('var', selectedVar);
          setFrame(version['date'], selectedVar);
        } else {
          varDropBtn.text('Universal');
          url.searchParams.set('var', 'universal');
          setFrame(version['date'], 'universal');
        }
        history.pushState({}, null, url.href);
        // window.location.assign(url);
      }
    });
  }
  function attachVariantlistner() {
    varDropBtn.next().find('.dropdown-item').on('click', function () {

      const version = versions.find(r => r['date'] === selectedVr);
      const variant = version['variant'].find(r => r['data'] === $(this).data('variant'));

      if (selectedVar !== variant['data']) {
        selectedVar = variant['data'];
        varDropBtn.text(variant['title']);
        setFrame(version['date'], selectedVar);

        const url = new URL(window.location.href);
        url.searchParams.set('var', selectedVar);
        history.pushState({}, null, url.href);

        // window.location.assign(url);
      }
    });
  }

  // set download
  let intId = NaN;
  $('#download-btn').on('click', function () {
    if (intId) {
      $(this).popover('dispose');
      $(this).find('i').each((_, e) => $(e).toggleClass('d-none'));
      clearInterval(intId);
      intId = NaN;
      return;
    }
    $(this).popover('show');
    $(this).find('i').each((_, e) => $(e).toggleClass('d-none'));
    let count = 8;
    $("#d-time").text(count);
    // remember that this timer will take 1000ms to start to initial 1sec delay
    intId = setInterval(() => {
      if (count === 1) {
        $(this).popover('dispose');
        $(this).find('i').each((_, e) => $(e).toggleClass('d-none'));
        const originalContents = document.innerHTML;
        document.innerHTML = resumeFr[0].contentWindow.document.innerHTML;
        window.print();
        document.innerHTML = originalContents;
        clearInterval(intId);
        intId = NaN;
        return;
      }
      $("#d-time").text(--count);
    }, 1000);
  });

});
