class JsonWebToken
  SECRET_KEY = Rails.application.secrets.secret_key_base
  def self.encode(payload, exp = 24.hours.from_now)
    # set expiry to 24 hours from creation time
    payload[:exp] = exp.to_i
    # sign token with application secret
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    # get payload; first index in decoded Array
    body = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new body
  rescue JWT::DecodeError => e # rescue from all decode errors
    # raise custom error to be handled by custom handler
    raise ExceptionHandler::InvalidToken, e.message
  end
end
