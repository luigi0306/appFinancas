const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verifica se o header existe
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // O formato esperado é "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    // Verifica se a palavra 'Bearer' está lá (ignora maiúsculas/minúsculas)
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatado.' });
    }

    // Valida o token com a sua chave secreta do .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        // Adiciona o ID do usuário decodificado na requisição para uso futuro
        req.userId = decoded.id;
        
        return next(); // Prossegue para o Controller
    });
};