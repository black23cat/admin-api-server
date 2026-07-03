const { startOfMonth, endOfMonth } = require('date-fns');
const queries = require('../lib/queries');

async function jobData(req, res, next) {
  try {
    const { page, dateStart, dateEnd } = req.query;
    const currentPage = Number(page ? page : 1);

    // "Get All if request doesn't provide any date"
    // "Get start date of given end date if end date include in request "
    // "Get end date of given start date if start date include in request "
    const todayDate = new Date();
    const startOfMonthDate =
      dateStart === '' || !dateStart
        ? startOfMonth(todayDate, 'yyyy-MM-dd')
        : new Date(dateStart);
    const endOfMonthDate =
      dateEnd === '' || !dateEnd
        ? endOfMonth(todayDate, 'yyyy-MM-dd')
        : new Date(dateEnd);

    if (startOfMonthDate > endOfMonthDate) {
      return res
        .status(400)
        .json('Tanggal Awal lebih besar dari tanggal akhir');
    }

    const options = {
      where: {
        invoiceId: { not: null },
        AND: { createdAt: { gte: startOfMonthDate, lte: endOfMonthDate } },
      },
      include: { fileList: true, invoice: true },
    };

    if (dateStart === '' && dateEnd === '') {
      delete options.where.AND;
    }

    const jobData = await queries.getJobData(currentPage, options);
    return res.status(200).json(jobData);
  } catch (error) {
    next(error);
  }
}

module.exports = { jobData };
