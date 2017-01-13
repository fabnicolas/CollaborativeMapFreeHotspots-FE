var showReport;

/** Funzione di servizio per ottenere l'id dell'utente la cui sessione è attiva **/
var userId;
function getUser() {
	return userId;
}

function destroyHome(){
    //$('body').empty(); <-- da' errore
    window.location.href='.';
}

/** Funzione di inizializzazione della pagina per visitatori **/
function createNotLoggedHome(){

    //setta l'id all'header
    $('.mdl-layout__header-row').attr('id','notlogged-header');

    //costruisce il menu
    menu = '<nav id="notlogged-menu" class="mdl-navigation">' +
             '<a id="show-login" class="mdl-navigation__link menuHeader" href="#">Accedi</a>' +
             '<span class="dividerHeader">|</span>' +
             '<a id="show-signup" class="mdl-navigation__link menuHeader" href="#">Crea un nuovo account</a>' +
           '</nav>';

    //lo aggiunge alla pagina
    $('.mdl-layout__header-row').append(menu);

       // [TEMP] Carica i modali da file
    $.get('notLoggedModal.html',function(data){
       $('body').append(data); //Li aggiunge all'index
        addNotLoggedModal(); //Li inizializza
    });

    document.getElementById("badgeNotificheHeader").setAttribute("hidden", "true");
    document.getElementById("tooltipApriMenu").setAttribute("hidden", "true");

} //./createNotLoggedHome


/** Funzione di inizializzazione della pagina per utenti connessi **/
function createLoggedHome(){
    document.getElementById("tooltipApriMenu").removeAttribute("hidden");
    ListenersHandler.addListener('tooltipApriMenu', 'click', function(){
            $( 'div[class^="mdl-layout__obfuscator"]' ).trigger( "click" );
    });


    // Rimuove l'immagine(logo) e lo spazio
    var parent = document.getElementById("toDelete").parentNode;
    var childToRemove = document.getElementById("toDelete");
    parent.removeChild(childToRemove);

    parent = document.getElementById("toDelete2").parentNode;
    childToRemove = document.getElementById("toDelete2");
    parent.removeChild(childToRemove);


    // Crea il menu con la funzione per uscire
    hello = '<nav class="mdl-navigation">' +
              '<a id="exitSystem" href="#" class="mdl-navigation__link menuHeader">Ciao <span id="name">Utente</span>, esci</a>' +
            '</nav>';

    // Crea il menu
    menu = '<div id="user-drawer" class="mdl-layout__drawer">' +
              '<span id="closeDrawer" class="iconCloseDrawer">' +
               '<i id="iconCloseDrawerOne" class="material-icons">navigate_before</i>' +
               '<i id="iconCloseDrawerTwo" class="material-icons">navigate_before</i>' +
              '</span>' +
              '<div id="imageLogo"></div>' +
              '<span class="mdl-layout-title" id="mainTitle">' +
                'Always<span style="font-weight: bolder">connected</span>' +
              '</span>' +
              '<nav id="logged-user-navigation" class="mdl-navigation">' +
                '<hr/>' +
                '<span class="mdl-layout-title subtitle">Gestione account</span>' +
                '<a id="show-mywifi" class="mdl-button mdl-js-button mdl-js-ripple-effect drawerlink" href="#"><span class="space"/><i class="material-icons">wifi</i><span class="space"/>Le mie reti</a>' +
                '<a id="show-mynotification" class="mdl-button mdl-js-button mdl-js-ripple-effect drawerlink" href="#"><span class="space"/><i class="material-icons">notifications</i><span class="space"/>Notifiche&nbsp&nbsp&nbsp&nbsp&nbsp<span hidden class="mdl-badge" data-badge="" id="badgeNotificheMenu"></span></a>'+
                '<a id="show-editpassword" onclick="inizializzaModificaPassword().showModal();" class="mdl-button mdl-js-button mdl-js-ripple-effect drawerlink" href="#"><span class="space"/><i class="material-icons">vpn_key</i><span class="space"/>Modifica Password</a>' +
                '<a id="show-deleteaccount" onclick="inizializzaCancellaAccount().showModal();" class="mdl-button mdl-js-button mdl-js-ripple-effect drawerlink" href="#"><span class="space"/><i class="material-icons">delete</i><span class="space"/>Elimina Account</a>' +
                '<a hidden id="test" class="mdl-button mdl-js-button mdl-js-ripple-effect drawerlink" href="#"><span class="space"/><i class="material-icons">warning</i><span class="space"/>TEST FORM SEGNALAZIONI</a>' +
              '</nav>' +
           '</div>' +
           '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="closeDrawer">' +
                'Chiudi men&ugrave' +
              '</div>' ;

    // Crea l'action button per inserire una mappa
    actionbtn = '<div id="left-actionbtn">'+
                  '<button id="show-addwifi" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">' +
                    '<i class="material-icons">add</i>'+
                  '</button>'+
                  '<div class="mdl-tooltip mdl-tooltip--left mdl-tooltip--large" data-mdl-for="show-addwifi">' +
                    'Inserisci nuova rete Wi-Fi' +
                  '</div>' +
                '</div>';

    /** Aggiunge le 3 componenti prima create:
        hello, nell'header;
        il menu, nell'header;
        l'action button, dopo il layout della pagina;
    **/
    $('.mdl-layout__header-row').append(hello);
    $('.mdl-layout__header').after(menu);
    $('.mdl-layout').after(actionbtn);


    // [TEMP] Carica i modali da file
    $.get('LoggedModal.html',function(data){
       $('body').append(data); //Li aggiunge all'index
        addLoggedModal(); //Li inizializza
    });

    gestioneNotifiche();
}


function gestioneNotifiche() {
  //GESTIONE NOTIFICHE
     var badgeHeader = document.getElementById("badgeNotificheHeader");
     var badgeMenu = document.getElementById("badgeNotificheMenu");

     //Se ci sono notifiche rendere visibilei i badge (nell'header e nel men�) eliminando l'attributo hidden (di default � hidden) e settare il numero di notifiche l'attributo data-badge="numero", altrimenti nasconderlo con hidden false
      badgeHeader.removeAttribute("hidden");
      badgeHeader.setAttribute("data-badge", "2");
      //apre il men� laterale al click sul badge nell'header
    ListenersHandler.addListener('badgeNotificheHeader', 'click', function(){
          $( 'div[class^="mdl-layout__obfuscator"]' ).trigger( "click" );
      });

      badgeMenu.removeAttribute("hidden");
      badgeMenu.setAttribute("data-badge", "2");

     //Altrimenti nascondere il badge
      //badgeHeader.setAttribute("hidden", "true");
      //badgeMenu.setAttribute("hidden", "true");
}

/** Inizializza i modali di un utente non connesso
    +Login
    +Recupera password
    +Registrati
**/
function addNotLoggedModal(){

    var signup, loginDialog, recover;

    setLoginModal();
    setSignupModal();
    setRecoverModal();
    setRecoverBisModal();

    function setLoginModal(){
        ListenersHandler.addListener('show-login', 'click', function(){
             loginDialog = document.getElementById('dialog-login'); //get dialog element
             if (!loginDialog.showModal) {
                dialogPolyfill.registerDialog(loginDialog);
             }

             /** close button function **/
             ListenersHandler.addListener('closebtn-login', 'click', function(){
                loginDialog.close();
             });

            /** login request **/
            ListenersHandler.addListener('enterbtna-login', 'click', function(){
				var email = $('#in-l-email').val();/*document.forms["login-form"]["l-email"].value;*/
				var password = $('#in-l-password').val();/*document.forms["login-form"]["l-password"].value;*/

                console.debug("value="+ JSON.stringify(email));
                console.debug("value="+ JSON.stringify(password));
			     signIn(email, password, function(status_ok, data){
                     console.debug("value s="+ JSON.stringify(status_ok));
                     console.debug("value d="+ JSON.stringify(data));
						if (status_ok){ //login ok
							userID = data;
                            setTimeout(function(){destroyHome();}, 1000);
						}else{ //errore nel login
							if(strcmp(data,'CANNOT_LOGIN')==0){
								// TODO visualizzazione errore login nel modale
                            }else if(strcmp(data,'ERROR_GENERATING_SESSION')==0){
                                console.log('1');
                            }else if(strcmp(data,'ERROR_EMAIL_PASSWORD')==0){
                                console.log('2');
                            }else if(strcmp(data,'ERROR_EMAIL')==0){
                                console.log('3');
                            }else if(strcmp(data,'ERROR_PASSWORD')==0){
                                console.log('4');
                            }else if(strcmp(data,'ERROR_CREDENTIALS')==0){
                                console.log('5');
                            }
						}
					});

	            });

            /**./Login request **/
                    loginDialog.showModal();

        });
     }

    function setRecoverModal(){
        ListenersHandler.addListener('show-recover', 'click', function(){
                recover = document.getElementById('dialog-recover'); //get dialog element
                  if (!recover.showModal) {
                    dialogPolyfill.registerDialog(recover);
                  }

                  /** close button function **/
                  ListenersHandler.addListener('closebtn-recover', 'click', function(){
                     //GO BACK to login modal, and hide recover
                     recover.close();
                     loginDialog.showModal();
                  });

                  loginDialog.close(); //nasconde il modale di login
                  recover.showModal();
        });
    }


    function setRecoverBisModal() {
        ListenersHandler.addListener('enterbtn-recover', 'click', function(){
         recoverBis = document.getElementById('dialog-recoverBis');
            if (!recoverBis.showModal) {
                    dialogPolyfill.registerDialog(recover);
            }

                 /** close button function **/
                 ListenersHandler.addListener('closebtn-recoverBis', 'click', function(){
                     recoverBis.close();
                  });


                  // Richiesta di recupero password
		    var email = $('#in-re-email').val(); //document.forms["reimposta-form"]["re-email"].value;

		    if (!(email === "")) {
			//  TODO controllo corrispondenza email e visualizza prossimo form
                        recover.close();
                        recoverBis.showModal();
		    }
		    else {
                        console.log('Email o password non inseriti');
		    }
      })
    }

    function setSignupModal(){
        ListenersHandler.addListener('show-signup', 'click', function(){
            signup = document.getElementById('dialog-signup'); //get dialog element
            if (! signup.showModal) {
                dialogPolyfill.registerDialog(signup);
            }

            /** close button function **/
            ListenersHandler.addListener('closebtn-signup', 'click', function() {
                signup.close();
            });

            signup.showModal();

            ListenersHandler.addListener('enterbtn-signup', 'click', function(){
                var email= $('#in-r-email').val();
                var password=$('#in-r-password').val();
                var confermapassword=$('#in-r-confermapassword').val();

                       /*console.debug("value="+ JSON.stringify(email));
                       console.debug("value="+ JSON.stringify(password));
                       console.debug("value="+ JSON.stringify(confermapassword));*/
                registration(email,password,confermapassword,function(status_ok,data){
                    console.debug("value="+ JSON.stringify(email));
                   if(status_ok){
                        console.debug("Registrazione ok");
                        console.debug("value="+ JSON.stringify(email));
                        setSignupBisModal();
                   }else{

                       if((strcmp(data,'CAMPI_EMAIL_PASSWORD_CONFERMAPASSWORD_NON_COMPILATI'))==0){
                           $('#r-email').toggleClass('is-invalid');
                           //$('#r-email-error').html("Campo non compilato");

                           $('#r-password').toggleClass('is-invalid');
                           //$('#r-password-error').html("Campo non compilato");


                           $('#r-confermapassword').toggleClass('is-invalid');
                          // $('#r-confermapassword-error').html("Campo non compilato");


                       }else if((strcmp(data,"CAMPI_EMAIL_PASSWORD_NON_COMPILATI"))==0){
                           $('#r-email').toggleClass('is-invalid');
                           $('#r-email-error').html("Campo non compilato");
                           $('#r-email-error').show();

                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Campo non compilato");
                           $('#r-password-error').show();


                       }else if((strcmp(data,"CAMPI_PASSWORD_CONFERMAPASSWORD_NON_COMPILATI"))==0){
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Campo non compilato");
                           $('#r-password-error').show();

                           $('#r-confermapassword').toggleClass('is-invalid');
                           $('#r-confermapassword-error').html("Campo non compilato");
                           $('#r-confermapassword-error').show();

                       }else if((strcmp(data,"CAMPI_EMAIL_CONFERMAPASSWORD_NON_COMPILATI"))==0){
                           $('#r-email').toggleClass('is-invalid');
                           $('#r-email-error').html("Campo non compilato");
                           $('#r-email-error').show();

                           $('#r-confermapassword').toggleClass('is-invalid');
                           $('#r-confermapassword-error').html("Campo non compilato");
                           $('#r-confermapassword-error').show();

                       }else if((strcmp(data,"CAMP0_EMAIL_NON_COMPILATO"))==0){
                           $('#r-email').toggleClass('is-invalid');
                           $('#r-email-error').html("Campo non compilato");
                           $('#r-email-error').show();

                       }else if((strcmp(data,"CAMP0_PASSWORD_NON_COMPILATO"))==0){
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Campo non compilato");
                           $('#r-password-error').show();

                       }else if((strcmp(data,"CAMP0_CONFERMAPASSWORD_NON_COMPILATO"))==0){
                           $('#r-confermapassword').toggleClass('is-invalid');
                           $('#r-confermapassword-error').html("Campo non compilato");
                           $('#r-confermapassword-error').show();

                       }else if((strcmp(data,"ERROR_EMAIL"))==0){
                           $('#r-email').toggleClass('is-invalid');
                           $('#r-email-error').show();

                       }else if((strcmp(data,"ERROR_PASSWORD"))==0){
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').show();

                       }else if((strcmp(data,"ERROR_PASSWORD_LENGHT"))==0){
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Lunghezza password non valida");
                           $('#r-password-error').show();

                       }else if((strcmp(data,"CAMPI_NON_COINCIDENTI"))==0){ //non completo
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Campo non coincidente");


                           $('#r-confermapassword').toggleClass('is-invalid');
                           $('#r-confermapassword-error').html("Campo non coincidente");

                       }else if((strcmp(data,"ERROR_EMAIL_PASSWORD"))==0){ //non completo
                           $('#r-email').toggleClass('is-invalid');
                           $('#r-email-error').html("Campo non compilato");
                           $('#r-password').toggleClass('is-invalid');
                           $('#r-password-error').html("Campo non compilato");

                       }else if((strcmp(data,"ERROR_DB"))==0){
                           showErrorDB('#dialog-signup', 'ERROR_DB');

                       }
                   }
                });
            });

        });

    }


    function setSignupBisModal() {
         signupBis = document.getElementById('dialog-signupBis');
            if (!signupBis.showModal) {
                    dialogPolyfill.registerDialog(recover);
            }

                 //* close button function **
                 ListenersHandler.addListener('closebtn-signupBis', 'click', function(){
                     signupBis.close();
                  });

             //TODO controllo campi
             signup.close();
             signupBis.showModal();
    }
}




/** Inizializza i modali di un utente connesso
    +Modifica Password
    +Elimina Account
    +Inserisci rete (mancante)
    +Notifiche (mancante)
    +Gestione reti (da completare)
**/
function addLoggedModal(){
    var mywifi;

    setExitModal();
    setEditPasswordBisModal();
    setMyWifiModal();
    setMyNotificationModal();
    setAskInsertWifiMode();

    function setAskInsertWifiMode(){
        ListenersHandler.addListener('show-addwifi', 'click', function(){
             askInsertWifiMode = document.getElementById('dialog-askinsertwifimode'); //get dialog element
             if (!askInsertWifiMode.showModal) {
                askInsertWifiMode.registerDialog(askInsertWifiMode);
             }

             /** close button function **/
             ListenersHandler.addListener('closebtn-askinsertwifimode', 'click', function(){
                askInsertWifiMode.close();
             });

             ListenersHandler.addListener('myposition-askinsertwifimode', 'click', function(){
              askInsertWifiMode.close();
              if(mutex_new_pin  == 0){
                    mutex_new_pin = 1;
                    addMarker(event.latLng, 'Click Generated Marker', map);
                }else{
                    alert("Completa prima l' inserimento di un pin");
                }

								getLocationFromLatLng(pos.lat, pos.lng, function(data){
		              data = jQuery.parseJSON(JSON.stringify(data))
		              data = data.results[0].formatted_address;
		              $('#dialog-insertnewwifi .mdl-dialog__sub').text(data);
		            });

                insertnewwifi.showModal();
             });

             ListenersHandler.addListener('custom-askinsertwifimode', 'click', function(){

              askInsertWifiMode.close();

              $('#dialog-insertnewwifi p').empty();
              google.maps.event.addListener(map,'click',function(event) {
                if(mutex_new_pin  == 0){
                    mutex_new_pin = 1;
                    addMarker(event.latLng, 'Click Generated Marker', map);
                }else{
                    alert("Completa prima l' inserimento di un pin");
                }
});



                //va fatto comparire il modal dopo aver piazzato il pin
                //insertnewwifi.showModal();
             });

             askInsertWifiMode.showModal();
           });

                insertnewwifi = document.getElementById('dialog-insertnewwifi'); //get dialog element
                if (!insertnewwifi.showModal) {
                   insertnewwifi.registerDialog(insertnewwifi);
                }

                inizializzaValutazione('#insert-quality',null);
                /** close button function **/

                ListenersHandler.addListener('closebtn-insertnewwifi', 'click', function(){
                   insertnewwifi.close();
                   if(mutex_new_pin == 1){
                        mutex_new_pin = 0;
                        new_marker.setMap(null);
                    }
                });

            ListenersHandler.addListener('enterbtn-insertnewwifi', 'click', function(){
                console.debug(mutex_new_pin);
                var ssid = $('#insert-nomerete input').val();
                var qualita = $('#insert-quality input').val();
                var necessita_login = $('#insert-login').is(':checked');
                if (necessita_login == false)
                    necessita_login = 0;
                if (necessita_login == true)
                    necessita_login = 1;
                var restrizioni = $('#insert-restrizioni input').val();
                var altre_informazioni = $('#insert-altreinfo input').val();
                var range = $('#insert-range input').val();
                var latitudine, longitudine;
                if(mutex_new_pin == 0){
                    latitudine = pos.lat;
                    longitudine = pos.lng;
                }
                if(mutex_new_pin == 1){
                    latitudine = new_pin_position.lat;
                    longitudine = new_pin_position.lng;
                }
                inseriscipin(ssid,qualita,latitudine,longitudine,necessita_login,restrizioni,altre_informazioni,range,function(status_ok, data){
                   if(status_ok){
                        showSnackbar({message: 'Rete Wi-Fi aggiunta correttamente.'});
                   }else{
                        if(strcmp(data, 'ERROR_SSID')==0){
                            $('#insert-nomerete-error').show();
                            $('#insert-input-error').html('Campo obbligatorio non compilato.');
                            $('#insert-input-error').show();
                        }else if(strcmp(data, 'ERROR_QUALITY')==0){
                            $('#insert-quality').toggleClass(".invalid");
                            $('#insert-input-error').html('Campo obbligatorio non compilato.');
                            $('#insert-input-error').show();
                        }else if(strcmp(data, 'ERROR_INVALID_DATA')==0){
                            $('#insert-input-error').html('Dati invalidi.');
                            $('#insert-input-error').show();
                        }else if(strcmp(data, 'ERROR_DB')==0){
                            showErrorDB('#dialog-insertnewwifi', 'ERROR_DB');
                        }
                   }

                });

            });
      }

    function setExitModal() {
      document.getElementById('exitSystem').addEventListener('click', function(){
        exitDialog = document.getElementById('dialog-exit');
        if (!exitDialog.showModal){
          dialogPolyfill.registerDialog(exitDialog);
        }

        var v = document.getElementById('closebtn-exit');
        v.addEventListener('click', function(){
          exitDialog.close();
        });

        document.getElementById('enterbtn-exit').addEventListener('click',function(){
            signOut(function(status_ok,data){
                if(status_ok){
                    destroyHome();
                }
            });
        });

        exitDialog.showModal();
      });


     }

    function setEditPasswordBisModal() {
      document.getElementById('enterbtn-editpassword').addEventListener('click', function(){
         editPasswordBis = document.getElementById('dialog-editPasswordBis');
            if (!editPasswordBis.showModal) {
                    dialogPolyfill.registerDialog(recover);
            }

                 /** close button function **/
                  var v = document.getElementById('closebtn-editPasswordBis');
                  v.addEventListener('click', function() {
                     editPasswordBis.close();
                  });

             //TODO controllo campi
             editpassword.close();
             editPasswordBis.showModal();
      })
    }



    function setDeleteAccountBisModal() {
      document.getElementById('enterbtn-deleteaccount').addEventListener('click', function(){
         deleteaccountBis = document.getElementById('dialog-deleteaccountBis');
            if (!deleteaccountBis.showModal) {
                    dialogPolyfill.registerDialog(recover);
            }

                 /** close button function **/
                  var v = document.getElementById('closebtn-deleteaccountBis');
                  v.addEventListener('click', function() {
                     deleteaccountBis.close();
                  });

             //TODO controllo campi
             deleteaccount.close();
             deleteaccountBis.showModal();
      })
    }




    function setMyWifiModal(){

        document.getElementById('show-mywifi').addEventListener('click', function(){

            mywifi = document.getElementById('dialog-mywifi'); //get dialog element

            if (! mywifi.showModal) {
                dialogPolyfill.registerDialog(mywifi);
            }

            /** close button function **/
            var v = document.getElementById('closebtn-mywifi');
            v.addEventListener('click', function() {

                mywifi.close();
            });



           mywifi.showModal();

        }); //./document

    } //./setMyWifiModal

    function setMyNotificationModal() {
      document.getElementById('show-mynotification').addEventListener('click', function(){
            showMyNotificationModal = document.getElementById('dialog-mynotification'); //get dialog element
            if (! showMyNotificationModal.showModal) {
                showMyNotificationModal.registerDialog(showMyNotificationModal);
            }
            var v = document.getElementById('closebtn-mynotification');
            v.addEventListener('click', function() {
                showMyNotificationModal.close();
            });
            showMyNotificationModal.showModal();

            function handleMouseClick(e) {
              //TODO Aggiornare il contatore notifiche e i 2 badge
              var clicked_element = e.target;

              if (clicked_element.nodeName == "I")
                 clicked_element.innerHTML = "notifications_none";
              else if (clicked_element.nodeName == "SPAN")
                 clicked_element.previousElementSibling.innerHTML = "notifications_none";

              clicked_element = clicked_element.parentNode.nextElementSibling;

              if (clicked_element.hasAttribute("hidden"))
              {
                clicked_element.removeAttribute("hidden");
              }
              else
              {
                clicked_element.setAttribute("hidden", "true");
              }

            }
            var x = document.getElementsByClassName("toHide");
             for (i = 0; i < x.length; i++) {
               x[i].addEventListener("click", handleMouseClick, false);
             }

      });



    }

}//./addLoggedModal



/** Gestisce lo snackbar. Accetta come parametro un oggetto con i seguenti attributi
        +string message,
        +int timeout *optional
        +string actionText, *optional
        +function actionHandler *optional
**/
function showSnackbar(sb){
    //get the snackbar component
    var snackbar = document.getElementById('sb-confirm-operation');

    //check the optional parameter
    if(!sb.timeout){sb.timeout = 2000;}
    if(!sb.actionText){sb.actionText = 'Annulla'; }
    if(!sb.actionHandler){sb.actionHandler = null;};

    //show the snackbar
    snackbar.MaterialSnackbar.showSnackbar(sb);
}


function inizializzaValutazione(stringselector,valoreiniziale){
  if(!valoreiniziale){valoreiniziale = 0;}
  var valutazione = {
    star: 5,
		selector: stringselector,
    htmlObj: $(stringselector +' .star-val button'),
    valoreiniziale: valoreiniziale,
    input: $(stringselector + ' input')
  }

  valutazione.setValutazione = function(val){
    if( !val ){ val = this.valoreiniziale;}
		console.log($(this.input));
    $(this.input).val(val);
		$(this.selector).attr( 'old' , val );
    $.each(this.htmlObj, function(i, star){

      if(i < val ){
        $(star).addClass('mdl-button--colored');
      }else{
        $(star).removeClass('mdl-button--colored');
      }//./if

    });//.each

  }//./setValutazione

  valutazione.setOnclick = function(){
		'use strict';
    var stars = this.htmlObj;
    var input = $(this.input);
		var selector = this.selector;
		var newval;
    $.each(stars, function(i,star){
      $(star).click(function(event){
            //vota(i+1);
				newval = event.target.id;
        for(var j=0; j < 5; j++){
          if(j<=i){
            $(stars[j]).addClass('mdl-button--colored');
          }else{
            $(stars[j]).removeClass('mdl-button--colored');
          } //./if

        }//./for
				$(selector).attr( 'old' , $(input).val() );
				$(input).val(newval);

    });//.click function
  });//./each

}//./setOnclick

  valutazione.setValutazione();
  valutazione.setOnclick();

}

/**function vota(voto){
    pinranking(jQuery.parseJSON($('#dialog-report').attr('data')).id, voto, function(status_ok, data){
        if(status_ok){
            showSnackbar({message: 'Valutazione effettuata con successo.'});
        }else{
            if(strcmp(data,"ERROR_SESSION_NOT_FOUND")==0){
                showSnackbar({message: 'Errore: devi effettuare l\'accesso.'});
            }else if(strcmp(data,"ERROR_RANKING")==0){
                showSnackbar({message: 'Errore nel ranking.'});
            }else if(strcmp(data,"ERROR_RANKING_ALREADY_DONE")==0){
                showSnackbar({message: 'Errore: hai già valutato questa rete.'});
            }else if(strcmp(data,"ERROR_DB")==0){
                showSnackbar({message: 'ERROR_DB'});
            }else if(strcmp(data,"ERROR_IS_OWNER")==0){
                showSnackbar({message: 'Errore: non sei il proprietario di questa rete!'});
            }
        }
    });
} **/

function showErrorDB(modale, codiceerrore){
  $(modale + ' .mdl-dialog__title').html('<h4 class="mdl-dialog__title"><i id="mdl-title-icon" class="material-icons">error</i>Ops!</h4>');
  $(modale + ' .mdl-dialog__sub').text('Si è verificato un errore');
  $(modale + ' .mdl-dialog__content').html("<p>Impossibile completare la richiesta. Riprova</p>");
  $(modale + ' .mdl-dialog__actions').html('<button onclick="location.reload();" type="button" class="mdl-button mdl-js-button mdl-js-ripple-effect dialog-close">Ricarica la pagina</button>');
  console.log('Impossibile completare la richiesta. Errore: '+codiceerrore);
}


function inizializzaSegnalazione() {

	showReport = document.getElementById('dialog-report'); //get dialog element
	if (!showReport.showModal) {
		showReport.registerDialog(showReport);
	}
	ListenersHandler.addListener('closebtn-report','click', function() {
		showReport.close();
	});
	ListenersHandler.addListener('enterbtn-report','click', function() {
		if(document.getElementById("option-1").checked) {
					showReport.close();
					rete = jQuery.parseJSON($('#dialog-report').attr('data'));
					$('#dialog-report-inexistent .mdl-dialog__sub').text('Rete: '+ rete.ssid);
					$('#enterbtn-inexistent').attr('data',rete.id);
					showInexistent.showModal();
				}
		if(document.getElementById("option-2").checked) {
			showReport.close();
			rete = jQuery.parseJSON($('#dialog-report').attr('data'));
			$('#dialog-report-range .mdl-dialog__sub').text('Rete: '+ rete.ssid);
			$('#enterbtn-report-range').attr('data',rete.id);
			showRangeErrato.showModal();
		}
		if(document.getElementById("option-3").checked) {
			showReport.close();
			rete = jQuery.parseJSON($('#dialog-report').attr('data'));
			$('#dialog-report-restriction .mdl-dialog__sub').text('Rete: '+ rete.ssid);
			$('#enterbtn-report-restriction').attr('data',rete.id);
			showRestrizioni.showModal();
		}
		if(document.getElementById("option-4").checked) {
			showReport.close();
			rete = jQuery.parseJSON($('#dialog-report').attr('data'));
			$('#dialog-report-login .mdl-dialog__sub').text('Rete: '+ rete.ssid);
			$('#enterbtn-report-login').attr('data',rete.id);
			showLoginNecessario.showModal();
		}
	});

	showInexistent = document.getElementById('dialog-report-inexistent'); //get dialog element

		if (! showInexistent.showModal) {
					 showInexistent.registerDialog(showInexistent);
	}
		ListenersHandler.addListener('closebtn-inexistent','click', function() {
			showInexistent.close();
			showReport.showModal();
	});
		ListenersHandler.addListener('enterbtn-inexistent','click', function() {

		segnala(jQuery.parseJSON($('#dialog-report').attr('data')).id, 0, '', function success(data){
			try {
				var ret = jQuery.parseJSON(JSON.stringify(data));
				showSnackbar({message: ret.message});
			} catch (err) {
				showSnackbar({message: ret.message});
			}
		});
		showInexistent.close();
	});

	showLoginNecessario = document.getElementById('dialog-report-login'); //get dialog element
		if (! showLoginNecessario.showModal) {
					 showLoginNecessario.registerDialog(showLoginNecessario);
				 }
		ListenersHandler.addListener('closebtn-report-login','click', function() {
						showLoginNecessario.close();
						showReport.showModal();
				 });
		ListenersHandler.addListener('enterbtn-report-login','click', function() {
			segnala(jQuery.parseJSON($('#dialog-report').attr('data')).id, 3, '', function success(data){
			 try {
				 var ret = jQuery.parseJSON(JSON.stringify(data));
				 showSnackbar({message: ret.message});
			 } catch (err) {
				 showSnackbar({message: ret.message});
			 }
		 });

		showLoginNecessario.close();
		});

	showRangeErrato = document.getElementById('dialog-report-range'); //get dialog element
		if (! showRangeErrato.showModal) {
					 showRangeErrato.registerDialog(showRangeErrato);
				 }
		ListenersHandler.addListener('closebtn-report-range','click', function() {
				showRangeErrato.close();
				showReport.showModal();
		});
		ListenersHandler.addListener('enterbtn-report-range','click', function() {
			segnala(jQuery.parseJSON($('#dialog-report').attr('data')).id, 1, $('#re-range textarea').val(), function success(data){
			 try {
				 var ret = jQuery.parseJSON(JSON.stringify(data));
				 showSnackbar({message: ret.message});
			 } catch (err) {
				 showSnackbar({message: ret.message});
			 }
			});

				showRangeErrato.close();
		});

	showRestrizioni = document.getElementById('dialog-report-restriction'); //get dialog element
		if (! showRestrizioni.showModal) {
			showRestrizioni.registerDialog(showRestrizioni);
		}
		ListenersHandler.addListener('closebtn-report-restriction','click', function() {
			showRestrizioni.close();
			showReport.showModal();
		});
		ListenersHandler.addListener('enterbtn-report-restriction','click', function() {
			segnala(jQuery.parseJSON($('#dialog-report').attr('data')).id, 2, $('#re-restriction textarea').val(), function success(data){
			 try {
				 var ret = jQuery.parseJSON(JSON.stringify(data));
				 showSnackbar({message: ret.message});
			 } catch (err) {
				 showSnackbar({message: ret.message});
			 }
		 });
			showRestrizioni.close();
		});

		return showReport;
	}
function inizializzaCancellaRete(){

	deletewifi = document.getElementById('dialog-deletewifi'); //get dialog element
	if (! deletewifi.showModal) {
		 dialogPolyfill.registerDialog(deletewifi);
	}
	var rete = jQuery.parseJSON($('#dialog-deletewifi').attr('data'));
	//console.log($('#toshow span').text());
	$('#dialog-deletewifi .mdl-dialog__content p').text(rete.ssid);
	ListenersHandler.addListener('closebtn-deletewifi','click', function() {
		 deletewifi.close();
	});
	ListenersHandler.addListener('enterbtn-deletewifi','click', function(){
		console.log('elimina');
	});

	return deletewifi;
}
function inizializzaModificaRete() {

	editwifidialog = document.getElementById('dialog-editwifi'); //get dialog element
	if (! editwifidialog.showModal) {
		dialogPolyfill.registerDialog(editwifidialog);
	}
	var rete = jQuery.parseJSON($('#dialog-editwifi').attr('data'));
	$('#subtitleNomeEditRete').text(rete.ssid);

	$('#newRestrizioni').addClass('is-dirty');
	$('#newRestrizioni input').val(rete.restrizioni);

	$('#newRange').addClass('is-dirty');
	$('#newRange input').val(rete.range_wifi);

	$('#newInfo').addClass('is-dirty');
	$('#newInfo input').val(rete.altre_informazioni);

	ListenersHandler.addListener('closebtn-editwifi','click', function() {
		editwifidialog.close();
	});
	ListenersHandler.addListener('enterbtn-editwifi','click', function(){
		editwifidialog.close();
		console.log('edit wifi call');
	});

	return editwifidialog;
}
function inizializzaCancellaAccount(){

	deleteaccount = document.getElementById('dialog-deleteaccount'); //get dialog element

	if (! deleteaccount.showModal) {
		dialogPolyfill.registerDialog(deleteaccount);
	}
	ListenersHandler.addListener('closebtn-deleteaccount', 'click', function(){
		deleteaccount.close();
	});
	ListenersHandler.addListener('enterbtn-deleteaccount','click', function(){
		console.log(getUser());
	});
	return deleteaccount;
}
function inizializzaModificaPassword(){

	editpassword = document.getElementById('dialog-editpassword'); //get dialog element
	if (! editpassword.showModal) {
		dialogPolyfill.registerDialog(editpassword);
	}
	ListenersHandler.addListener('closebtn-editpassword','click', function() {
		editpassword.close();
	});
	ListenersHandler.addListener('enterbtn-editpassword','click', function() {
		console.log('Modifica password per: '+ getUser());
	});
	return editpassword;
}

function getLocationFromLatLng(lat,lng, onsuccess){
	$.get({
		url: 'http://maps.googleapis.com/maps/api/geocode/json?',
		data: 'latlng='+lat+','+lng,
		success: function(data){
			onsuccess(data); }
		});
}

/**
function setDeleteWifi(){







				 var v = document.getElementById('closebtn-deletewifi');
				 v.addEventListener('click', function() {
						deletewifi.close();
						mywifi.showModal();
				 });

				 var vv = document.getElementById('enterbtn-deletewifi');
				 vv.addEventListener('click', function() {
						deletewifi.close();
						'use strict';
						var snackbarContainer = document.querySelector('#sb-confirm-operation');
						var data;
						//TODO: send request TRUE o FALSE, delete wifi, delete pin on maps
						//Se tutto va bene allora
							 //Snackbar
									 data = {message: 'Rete Wi-Fi eliminata con successo.'};
									 snackbarContainer.MaterialSnackbar.showSnackbar(data);
							 //refresh wifi list
									 document.getElementById(idToDelete).parentNode.removeChild(document.getElementById(idToDelete));
									 mywifi.showModal();
						//Altrimenti
									 //data = {message: 'Rete Wi-Fi non eliminata.'};
									 //snackbarContainer.MaterialSnackbar.showSnackbar(data);

				 });

			}


} //./setDeleteWifi **/
