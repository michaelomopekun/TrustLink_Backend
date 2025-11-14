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