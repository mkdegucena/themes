var sections = []

var titles = [
    "At iste non dolendi status",
    "Quod autem principium officii quaerunt?",
    "Itaque ab his ordiamur",
    "Etenim semper illud extra est",
    "Quod arte comprehenditur",
    "Atque hoc loco similitudines eas",
    "Quid ad utilitatem tantae pecuniae?",
    "Tu enim ista lenius",
    "Quae cum dixisset paulumque institisset, Quid est?",
    "Avaritiamne minuis?",
  ],
  content = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scaevolam M. Nulla erit controversia.  <i>Pugnant Stoici cum Peripateticis.</i>  <b>Duo Reges: constructio interrete.</b></p><p>Sedulo, inquam, faciam. Sumenda potius quam expetenda.  <strong>At enim sequor utilitatem.</strong></p><h2>Sed ille, ut dixi, vitiose.</h2><p>Non semper, inquam; Certe, nisi voluptatem tanti aestimaretis. Quae sequuntur igitur? Sit sane ista voluptas. Poterat autem inpune; Quorum altera prosunt, nocent altera. </p><p>  <strong>Sin aliud quid voles, postea.</strong> Pollicetur certe. Age sane, inquam. Sed haec in pueris; </p><ul>  <li>Eadem nunc mea adversum te oratio est.</li>  <li>Aut haec tibi, Torquate, sunt vituperanda aut patrocinium voluptatis repudiandum.</li>  <li>Sed quoniam et advesperascit et mihi ad villam revertendum est, nunc quidem hactenus;</li>  <li>Tum Triarius: Posthac quidem, inquit, audacius.</li>  <li>Sin laboramus, quis est, qui alienae modum statuat industriae?</li>  <li>Videsne, ut haec concinant?</li></ul><p>Ita credo. Quo tandem modo? Cur post Tarentum ad Archytam?  <i>Poterat autem inpune;</i>  <i>Tu quidem reddes;</i> Et nemo nimium beatus est; </p><p>Nam ante Aristippus, et ille melius.  <a href='http://loripsum.net/' target='_blank'>At enim sequor utilitatem.</a>  <b>Hic nihil fuit, quod quaereremus.</b>  <b>Igitur ne dolorem quidem.</b> Ut pulsi recurrant? Tum mihi Piso: Quid ergo? Non igitur bene. Id est enim, de quo quaerimus. </p><h3>Causa autem fuit huc veniendi ut quosdam hinc libros promerem.</h3><p>Laboro autem non sine causa;  <i>An eiusdem modi?</i></p><p>Hunc vos beatum; Res enim concurrent contrariae. Si longus, levis;  <a href='http://loripsum.net/' target='_blank'>Sed plane dicit quod intellegit.</a> Quantum Aristoxeni ingenium consumptum videmus in musicis? Atqui reperies, inquit, in hoc quidem pertinacem; </p><ol>  <li>Cur tantas regiones barbarorum pedibus obiit, tot maria transmisit?</li>  <li>Sin laboramus, quis est, qui alienae modum statuat industriae?</li>  <li>Quem quidem vos, cum improbis poenam proponitis, inpetibilem facitis, cum sapientem semper boni plus habere vultis, tolerabilem.</li></ol>";


createArticles(sections);

function createArticles(sections) {
  $.get("/api/v2/users/me.json").then(function(data) {
    var token = data.user.authenticity_token;

    _.each(sections, function(sectionId) {
      var randomTitles = shuffleList(titles);

      _.each(randomTitles, function(title) {
        var articleData = {
            article: {
              title: title,
              body: content,
              locale: 'en-us'
            }
          },
          data = JSON.stringify(articleData);

        $.ajax({
          type: "POST",
          dataType: "application/json",
          contentType: "application/json",
          url: "/api/v2/help_center/sections/" + sectionId + "/articles.json",
          data: data
        });
      }, this);
    }, this);
  });
}

function shuffleList(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
