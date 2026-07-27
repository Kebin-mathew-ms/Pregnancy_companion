from flask import *
from public import *
from admin import *
from asha import *
from api import *

main =Flask(__name__, template_folder='templates')


secret_key='ashu'
main.secret_key=secret_key

main.register_blueprint(public)
main.register_blueprint(admin)
main.register_blueprint(asha)
main.register_blueprint(api)

main.run(debug=True,host='0.0.0.0',port=7000)
