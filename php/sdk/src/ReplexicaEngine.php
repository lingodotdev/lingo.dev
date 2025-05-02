<?php

namespace Lingodotdev\Sdk;

/**
 * @deprecated Use LingoDotDevEngine instead. This class is maintained for backwards compatibility.
 */
class ReplexicaEngine extends LingoDotDevEngine
{
    private static $hasWarnedDeprecation = false;

    /**
     * Create a new ReplexicaEngine instance
     * 
     * @param array $config Configuration options for the Engine
     */
    public function __construct(array $config = [])
    {
        parent::__construct($config);
        
        if (!self::$hasWarnedDeprecation) {
            trigger_error(
                'ReplexicaEngine is deprecated and will be removed in a future release. ' .
                'Please use LingoDotDevEngine instead. ' .
                'See https://docs.lingo.dev/migration for more information.',
                E_USER_DEPRECATED
            );
            self::$hasWarnedDeprecation = true;
        }
    }
}
