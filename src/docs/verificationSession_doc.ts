//verification session endpoints documentation

/**
 * @swagger
 * /api/verification-session/create:
 *   post:
 *     summary: Create a new verification session
 *     description: Initializes a new verification session for the authenticated user to start the trust verification process
 *     tags:
 *       - Verification Session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Verification session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verificationSession:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique verification session ID
 *                     userId:
 *                       type: string
 *                       description: User ID associated with this session
 *                     signals:
 *                       type: object
 *                       description: Trust signals data object
 *                     score:
 *                       type: number
 *                       description: Current trust score (0-100)
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: verification session initialized successfully
 *       400:
 *         description: Bad Request - Verification session already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verification session already started/initialized for user
 *                 sessionId:
 *                   type: string
 *       401:
 *         description: Unauthorized - No or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: failed to create verification session
 */


/**
 * @swagger
 * /api/verification-session/device-signals/{sessionId}:
 *   post:
 *     summary: add device signals for a verification session
 *     description: Retrieves and analyzes device signals (IP, user agent, VPN detection, device hash) for an active verification session
 *     tags:
 *       - Verification Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification session ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Device signals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signals:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       description: User's IP address
 *                       example: 192.168.1.1
 *                     userAgent:
 *                       type: string
 *                       description: Browser user agent string
 *                       example: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
 *                     deviceHash:
 *                       type: string
 *                       description: SHA256 hash of IP + user agent for device identification
 *                       example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
 *                     vpnDetected:
 *                       type: boolean
 *                       description: Whether VPN/proxy detected
 *                       example: false
 *                     score:
 *                       type: number
 *                       description: Device trust score (-50 to 20)
 *                       example: 20
 *                 message:
 *                   type: string
 *                   example: device signals retrieved successfully
 *       400:
 *         description: Bad Request - Insufficient data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: insufficient data to retrieve device signals
 *       401:
 *         description: Unauthorized - No or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Verification session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verification session not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: failed to retrieve device signals
 */

/**
 * @swagger
 * /api/verification-session/location-signals/{sessionId}:
 *   post:
 *     summary: Add location signals to verification session
 *     description: Captures and analyzes geolocation data (IP geolocation, timezone, country) for trust verification
 *     tags:
 *       - Verification Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification session ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Location signals added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signals:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       description: User's IP address
 *                       example: 192.168.1.1
 *                     country:
 *                       type: string
 *                       description: Country code from IP geolocation
 *                       example: US
 *                     city:
 *                       type: string
 *                       description: City from IP geolocation
 *                       example: New York
 *                     timezone:
 *                       type: string
 *                       description: Timezone associated with location
 *                       example: America/New_York
 *                     latitude:
 *                       type: number
 *                       description: Geographic latitude
 *                       example: 40.7128
 *                     longitude:
 *                       type: number
 *                       description: Geographic longitude
 *                       example: -74.0060
 *                     isp:
 *                       type: string
 *                       description: Internet Service Provider name
 *                       example: Verizon Communications
 *                     score:
 *                       type: number
 *                       description: Location trust score (-30 to 15)
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: location signals added successfully
 *       400:
 *         description: Bad Request - Insufficient geolocation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: insufficient geolocation data
 *       401:
 *         description: Unauthorized - No or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Verification session not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verification session not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: failed to add location signals
 */