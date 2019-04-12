function validate(email, password, repassword, firstname, lastname){
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var password = document.getElementById("repassword");
  var password = document.getElementById("firstname");
  var password = document.getElementById("lastname");
}

//Validate Email
function validateEmail(){
  var email = document.getElementById("email");
  var emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(email.value.match(emailregex)){
    //console.log("matched!");
    return true;
  }
  else{
    return false;
  }
}

//Validate for strong password: must have at least 8 characters, contain at least 1 upper and 1 lower case letter and 1 number
function validatePassword(){
  var password = document.getElementById("password");
  var pwregex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  if(password.value.match(pwregex)){
    console.log("password strong");
    return true;
  }
  else{
    console.log("password not strong enough");
    return false;
  }
}

//check if password match
function passwordMatch(){
  var password = document.getElementById("password");
  var repassword = document.getElementById("repassword");
  if(password.value == repassword.value){
    return true;
  }
  else{
    return false;
  }
}

//check if name contains special character
function checkName(){
  var firstname = document.getElementById("firstname");
  var lastname = document.getElementById("lastname");
  //letter only and should be between 2-30 characters
  var letteronlyreg = /^[a-zA-Z ]{2,30}$/;
  if(!firstname.value.match(letteronlyreg)){
    errorresult.innerHTML = "Invalid First name. First Name must not contain any special character or number and should be from 2-30 characters.";
    return false;
  }
  else if(!lastname.value.match(letteronlyreg)){
    errorresult.innerHTML = "Invalid Last name. Last Name must not contain any special character or number and should be from 2-30 characters.";
    return false;
  }
  else{
    return true;
  }
}

function runValidation(){
  if(!validateEmail()){
    errorresult.innerHTML = "Invalid email. Please input email in the correct format.";
    return false;
  }
  else if(!validatePassword()){
    errorresult.innerHTML = "Password is not strong enough. Password must be 8 characters or longer, and must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric character, and 1 special character.";
    //alert("Password is not strong enough. Password must be 8 characters or longer, and must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric character, and 1 special character.");
    return false;
  }
  else if(!passwordMatch()){
    errorresult.innerHTML = "Password does not match. Plese input the password again.";
    return false;
  }
  else if(!checkName()){
    return false;
  }
  else{
    return true;
  }
}

///
window.onload = function(){
    var mainForm = document.getElementById("mainForm");
    var errorresult = document.getElementById("errorresult");

    //all inputs with the class required are looped through
    var requiredInputs = document.querySelectorAll(".required");
    for (var i=0; i < requiredInputs.length; i++){
		requiredInputs[i].onblur = function(){
	    	this.style.fontWeight = "normal";
	    	this.style.backgroundColor = "#FFFFFF";
		    }
    }

  mainForm.onsubmit = function(e){
    console.log("submitted");


    //check for empty input on required fields
    var inputallfields = true;
    for (var i=0; i < requiredInputs.length; i++){
      //if blank
      if( isBlank(requiredInputs[i]) ){
        e.preventDefault();
        //highlightRed(requiredInputs[i]);
        errorresult.innerHTML = "Please input all the required fields";
	    }
      //if not pass validation
      else if(!runValidation()){
        e.preventDefault();
      }
	    else{
        makeClean(requiredInputs[i]);
        console.log("pass!");

	    }
    }

  }
}

function highlightRed(inputDiv){
	inputDiv.style.borderColor="red"
	//inputDiv.parentNode.style.backgroundColor="red";

}
//remove all error styles from the div passed in
function makeClean(inputDiv){
	inputDiv.style.backgroundColor="white"
	//inputDiv.parentNode.style.backgroundColor="#FFFFFF";

}

function isBlank(inputField){
    if(inputField.type=="checkbox"){
	if(inputField.checked)
	    return false;
	return true;
    }
    if (inputField.value==""){
	return true;
    }
    return false;
}
